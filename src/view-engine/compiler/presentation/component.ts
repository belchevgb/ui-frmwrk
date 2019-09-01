import "reflect-metadata";
import { registerType, Injectable, resolve } from "../../../di";
import { defineMetadata } from "../../../common/metadata";

type PropChangeFunc = (changedPropKey: any, prevValue: any, newValue: any) => void;

interface IPropertyBag {
    [key: string]: any;
}

/**
 * Persists all properties that the change detection tracks.
 */
export class DataStore implements IPropertyBag {
    private onChange: PropChangeFunc;

    registerOnChange(onChange: PropChangeFunc) {
        this.onChange = onChange;
    }
}

function createDataStore(): IPropertyBag {
    const store = new Proxy(new DataStore(), {
        set: (obj: any, key, newValue) => {
            const prevValue = obj[key];
            const isFirstChange = !(key in obj);

            obj[key] = newValue;

            if (obj.onChange && !isFirstChange) {
                obj.onChange(key, prevValue, newValue);
            }

            return true;
        }
    });

    return store;
}

export interface IComponentConfig {
    selector: string;
    template: string;
}

export const COMPONENT_CONFIG_MD_KEY = "cmp-cfg";

/**
 * Decorator that marks classes as component.
 * @param config Component's configuration.
 */
export function ComponentDef(config: IComponentConfig) {
    return (componentType: any) => {
        defineMetadata(COMPONENT_CONFIG_MD_KEY, config, componentType);

        const componentStore: ComponentStore = resolve(ComponentStore);

        componentStore.registerComponent(config.selector, { componentType, template: config.template });
        registerType(componentType);
    };
}

/**
 * Base class for all the components in the application.
 */
export abstract class Component {
    data = createDataStore();
}

export interface IComponentRegistration {
    template: string;
    componentType: any;
}

/**
 * Persists component registrations by their selector.
 */
@Injectable
export class ComponentStore {
    private components = new Map<string, IComponentRegistration>();

    /**
     * Registers new component data.
     * @param selector Component's selector.
     * @param registration Component registration that contains component data.
     */
    registerComponent(selector: string, registration: IComponentRegistration) {
        this.components.set(selector, registration);
    }

    /**
     * Retrieves component registration.
     * @param selector Component's selector.
     */
    getRegistration(selector: string) {
        return this.components.get(selector);
    }
}