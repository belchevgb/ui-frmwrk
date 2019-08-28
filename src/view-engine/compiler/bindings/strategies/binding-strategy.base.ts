import { Component } from "../../presentation/component";

export abstract class BindingStrategyBase {
    constructor(protected element: HTMLElement, protected propName: string, protected component: Component) { }

    abstract update(value: any): void;
}