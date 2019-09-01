import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../presentation/component";

export class AttributeBindingStrategy extends BindingStrategyBase<HTMLElement> {
    private currentValue = "";

    constructor(element: HTMLElement, private attributeName: string, component: Component) {
        super(element, component);
    }

    update(value: any): void {
        if (value === null || value === undefined) {
            value = "";
        }

        let attributeValue = this.element.getAttribute(this.attributeName);
        const newValueTokens = attributeValue
            .split(" ")
            .filter(x => x !== this.currentValue);

        newValueTokens.push(value);
        attributeValue = newValueTokens.join(" ");
        this.currentValue = value;
        this.element.setAttribute(this.attributeName, attributeValue);
    }
}