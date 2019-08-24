import { Node } from "../parser/parser";
import { Component, DataStore } from "./component";

export class ComponentView {
    constructor(public parent: ComponentView, public component: Component, public presentation: HTMLElement) {
        const store = component.data as DataStore;
        store.registerOnChange((a, b, c) => this.update(a, b, c));
    }

    private update(changedPropKey: any, prevValue: any, newValue: any) {

    }
}