import { Component } from "../../presentation/component";

export abstract class BindingStrategyBase<T> {
    constructor(protected element: T, protected propName: string, protected component: Component) { }

    abstract update(value: any): void;
}