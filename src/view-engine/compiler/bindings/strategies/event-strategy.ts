import { BindingStrategyBase } from "./binding-strategy.base";
import { Component } from "../../../..";

export class EventBindingStrategy extends BindingStrategyBase<HTMLElement> {
    constructor(protected element: HTMLElement, protected component: Component, private eventName: string, private eventHandlerName: string) {
        super(element, component);
        this.subscribeForEvent();
    }

    update(value: any): void {
    }

    private subscribeForEvent() {
        if (this.eventHandlerName in this.component &&
            typeof this.component[this.eventHandlerName] === "function") {

            this.element.addEventListener(this.eventName, e => this.component[this.eventHandlerName](e));
        }
    }
}