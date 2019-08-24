import "reflect-metadata";
import { validateIsFunction } from "./helpers";

export function getParamTypes(func: Function): any[] {
    validateIsFunction(func, "The passed object is not a function.");

    const params = Reflect.getMetadata("design:paramtypes", func) || [];
    return params;
}
