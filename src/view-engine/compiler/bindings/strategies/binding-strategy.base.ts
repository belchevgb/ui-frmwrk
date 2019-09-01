import { Component } from "../../presentation/component";

export abstract class BindingStrategyBase<T> {
    constructor(protected element: T, protected component: Component) { }

    abstract update(value: any): void;
}