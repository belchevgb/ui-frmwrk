import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../../..";
import { hasValue } from "../../../../common/helpers";

/**
 * Handles the update of interpolated property in text content.
 */
export class TextBindingStrategy extends BindingStrategyBase<Text> {
    constructor(element: Text, component: Component) {
        super(element, component);
    }

    /**
     * Updates the text content's value.
     * @param value The new value.
     */
    update(value: string): void {
        if (!hasValue(value)) {
            value = "";
        }

        this.element.nodeValue = value;
    }
}