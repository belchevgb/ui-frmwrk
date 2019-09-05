import "reflect-metadata";
import { registerType } from "../../../di";
import { defineMetadata } from "../../../common/metadata";
import { ComponentView } from "./view";

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

            obj[key] = newValue;

            if (obj.onChange) {
                obj.onChange(key, prevValue, newValue);
            }

            return true;
        }
    });

    return store;
}

export interface IComponentConfig {
    selector: string;
    template?: string;
    templateUrl?: string;
}

export const COMPONENT_CONFIG_MD_KEY = "cmp-cfg";

/**
 * Decorator that marks classes as component.
 * @param config Component's configuration.
 */
export function ComponentDef(config: IComponentConfig) {
    return (componentType: any) => {
        defineMetadata(COMPONENT_CONFIG_MD_KEY, config, componentType);

        ComponentStore.registerComponent(config.selector, { componentType, template: config.template });
    };
}

/**
 * Base class for all the components in the application.
 */
export abstract class Component {
    view: ComponentView;
    data = createDataStore();
}

export interface IComponentRegistration {
    template: string;
    componentType: any;
}

export type Type<T> = new (...args: any[]) => T;

/**
 * Persists component registrations by their selector.
 */
export class ComponentStore {
    private static components = new Map<string, IComponentRegistration>();

    /**
     * Registers new component data.
     * @param selector Component's selector.
     * @param registration Component registration that contains component data.
     */
    static registerComponent(selector: string, registration: IComponentRegistration) {
        ComponentStore.components.set(selector, registration);
    }

    /**
     * Retrieves component registration.
     * @param selector Component's selector.
     */
    static getRegistration(selector: string) {
        return ComponentStore.components.get(selector);
    }
}
