import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../presentation/component";

export class TextBindingStrategy extends BindingStrategyBase<Text> {
    constructor(element: Text, propName: string, component: Component) {
        super(element as any, propName, component);
    }

    update(value: string): void {
        if (value === null || value === undefined) {
            value = "";
        }

        this.element.nodeValue = value;
    }
}