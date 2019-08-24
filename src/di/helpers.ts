export function isFunction(obj: any) {
    return typeof obj === "function";
}

export function isString(obj: any) {
    return typeof obj === "string";
}

export function validateHasValue(val: any, message = "") {
    if (val === undefined || val === null) {
        throw new Error(message);
    }
}

export function validateIsFunction(val: any, message = "") {
    if (!isFunction(val)) {
        throw new Error(message);
    }
}

export function validateArrayLengthNotGreater(arr: any[], length: number, message = "") {
    if (Array.isArray(arr) && arr.length > length) {
        throw new Error(message);
    }
}
