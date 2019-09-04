import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../presentation/component";

/**
 * Handles the update of parent component property which is bound to child cpmponent's property.
 */
export class ComponentPropertyBindingStrategy extends BindingStrategyBase<HTMLElement> {
    constructor(element: HTMLElement, component: Component, private childComponent: Component, private childPropName: string, private parentPropName: string) {
        super(element, component);
    }

    update(val: any): void {
        if (this.parentPropName in this.component.data) {
            return this.childComponent.data[this.childPropName] = this.component.data[this.parentPropName];
        }

        this.childComponent.data[this.childPropName] = val;
    }
}