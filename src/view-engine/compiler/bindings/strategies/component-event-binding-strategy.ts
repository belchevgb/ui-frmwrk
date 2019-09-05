import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../../../exports";
import { ComponentEvent } from "../../presentation/component-event";

/**
 * Handles the raise of child component's event, for which a parent component is listening.
 */
export class ComponentEventBindingStrategy {
    constructor(private component: Component, private eventName: string, private eventHandlerName: string, private childComponent: Component) {
        this.subscribeForEvent();
    }

    update(_: any): void {
    }

    protected subscribeForEvent() {
        const componentEvent = this.childComponent[this.eventName];

        if (componentEvent && componentEvent instanceof ComponentEvent) {
            componentEvent.subscribe((e) => this.component[this.eventHandlerName](e));
        }
    }
}