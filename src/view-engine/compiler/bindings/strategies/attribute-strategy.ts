import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../presentation/component";
import { hasValue } from "../../../../common/helpers";

/**
 * Handles the update of interpolated property in attribute.
 */
export class AttributeBindingStrategy extends BindingStrategyBase<HTMLElement> {
    private currentValue = "";

    constructor(element: HTMLElement, private attributeName: string, component: Component) {
        super(element, component);
    }

    /**
     * Updates the attribute's value.
     * @param value The new value.
     */
    update(value: any): void {
        if (!hasValue(value)) {
            value = "";
        }

        let attributeValue = this.element.getAttribute(this.attributeName);
        const newValueTokens = attributeValue
            .split(" ")
            .filter(x => x !== this.currentValue.toString());

        newValueTokens.push(value);
        attributeValue = newValueTokens.join(" ");
        this.currentValue = value;
        this.element.setAttribute(this.attributeName, attributeValue);
    }
}