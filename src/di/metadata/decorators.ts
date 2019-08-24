import { IConstructible } from "../interfaces";
import "reflect-metadata";
import { IInjectionMetadata, metadataStore } from "./metadata-store";

export enum MetadataKeys {
    ResolveAll
}

export const decoratorsData = new Map<any, any>();

/**
 * Marks type which should be injected or injection should be performed on.
 * @param ctor The type's constructor.
 */
export function Injectable(ctor: IConstructible) { }

/**
 * Configures injection different than the default. This applies to parameters.
 * @param injectionData The injection configuration.
 */
export function Inject(injectionData: IInjectionMetadata) {
    return (target: IConstructible, _: any, propertyIndex: number) => {
        metadataStore.setMetadata(target, propertyIndex, injectionData);
    };
}

/**
 * Configures property injection of type.
 * @param injectionData The injection configuration.
 */
export function PropertyInjection(injectionData: IInjectionMetadata) {
    return (target: Object, propName: string) => {
        metadataStore.setMetadata(target.constructor, propName, injectionData);
    };
}
