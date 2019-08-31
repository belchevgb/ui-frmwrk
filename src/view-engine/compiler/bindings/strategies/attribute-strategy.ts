import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../presentation/component";

export class AttributeBindingStrategy extends BindingStrategyBase<HTMLElement> {
    constructor(element: HTMLElement, propName: string, component: Component, private attributeName: string) {
        super(element, propName, component);
    }

    update(value: any): void {
    }
}