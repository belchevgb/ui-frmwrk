import "reflect-metadata";
import { registerType, Injectable } from "../../../di";

type PropChangeFunc = (changedPropKey: any, prevValue: any, newValue: any) => void;

interface IPropertyBag {
    [key: string]: any;
}

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

export function ComponentDef(config: IComponentConfig) {
    return (componentType: any) => {
        Reflect.defineMetadata(COMPONENT_CONFIG_MD_KEY, config, componentType);
        registerType(componentType);
    };
}

export abstract class Component {
    data = createDataStore();
}

export interface IComponentRegistration {
    template: string;
    componentType: any;
}

@Injectable
export class ComponentStore {
    private components = new Map<string, IComponentRegistration>();

    registerComponent(selector: string, registration: IComponentRegistration) {
        this.components.set(selector, registration);
    }

    getRegistration(selector: string) {
        return this.components.get(selector);
    }
}