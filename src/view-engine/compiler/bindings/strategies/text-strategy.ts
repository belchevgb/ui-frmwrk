import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../presentation/component";

export class TextBindingStrategy extends BindingStrategyBase {
    constructor(element: HTMLElement, propName: string, component: Component) {
        super(element, propName, component);
    }

    update(value: any): void {
    }
}