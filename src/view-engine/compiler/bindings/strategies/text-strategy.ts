import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../../..";

export class TextBindingStrategy extends BindingStrategyBase<Text> {
    constructor(element: Text, component: Component) {
        super(element, component);
    }

    update(value: string): void {
        if (value === null || value === undefined) {
            value = "";
        }

        this.element.nodeValue = value;
    }
}