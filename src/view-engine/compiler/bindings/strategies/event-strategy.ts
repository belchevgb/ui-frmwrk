import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../../..";
import { isFunction } from "../../../../common/helpers";

/**
 * Handles the raise of specific DOM event.
 * When the event is raised, the strategy calls the registered component's method.
 */
export class EventBindingStrategy extends BindingStrategyBase<HTMLElement> {
    constructor(protected element: HTMLElement, protected component: Component, private eventName: string, private eventHandlerName: string) {
        super(element, component);
        this.subscribeForEvent();
    }

    update(value: any): void {
    }

    private subscribeForEvent() {
        if (this.eventHandlerName in this.component &&
            isFunction(this.component[this.eventHandlerName])) {

            this.element.addEventListener(this.eventName, e => this.component[this.eventHandlerName](e));
        }
    }
}