import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../../..";
import { isFunction } from "../../../../common/helpers";

/**
 * Handles the raise of specific DOM event.
 * When the event is raised, the strategy calls the registered component's method.
 */
export class EventBindingStrategy {
    constructor(private element: HTMLElement, private component: Component, private eventName: string, private eventHandlerName: string) {
        this.subscribeForEvent();
    }

    private subscribeForEvent() {
        if (this.eventHandlerName in this.component &&
            isFunction(this.component[this.eventHandlerName])) {

            this.element.addEventListener(this.eventName, e => this.component[this.eventHandlerName](e));
        }
    }
}