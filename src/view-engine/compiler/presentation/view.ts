import { Component, DataStore } from "./component";
import { BindingStrategyBase } from "../bindings/strategies/binding-strategy.base";

export class ComponentView {
    children: ComponentView[] = [];
    presentation: HTMLElement;
    bindings = new Map<any, BindingStrategyBase[]>();

    constructor(public parent: ComponentView, public component: Component) {
        const store = component.data as DataStore;
        store.registerOnChange((a, b, c) => this.update(a, b, c));
    }

    private update(changedPropKey: any, prevValue: any, newValue: any) {
        if (prevValue === newValue) {
            return;
        }

        const strategies = this.bindings.get(changedPropKey) || [];

        strategies.forEach(s => s.update(newValue));
        this.children.forEach(c => c.update(changedPropKey, prevValue, newValue));
    }
}