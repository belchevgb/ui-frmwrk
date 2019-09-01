import { validateIsFunction } from "./helpers";

/**
 * Extracts parameter types of a function.
 * @param func The function from which the paramer types will be extracted.
 */
export function getParamTypes(func: Function): any[] {
    validateIsFunction(func, "The passed object is not a function.");

    const params = Reflect.getMetadata("design:paramtypes", func) || [];
    return params;
}

/**
 * Defines metadata on a object.
 * @param metadataKey The key of the metadata.
 * @param metadataValue The value of the metadata.
 * @param target The object on which the metatada will be defined.
 */
export function defineMetadata(metadataKey: any, metadataValue: any, target: Object) {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
}
