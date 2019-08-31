export abstract class BindingStrategyBase<T> {
    constructor(protected element: T) { }

    abstract update(value: any): void;
}