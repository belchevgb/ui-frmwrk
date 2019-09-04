import { Component, DataStore } from "./component";
import { BindingStrategyBase } from "../bindings/strategies/binding-strategy.base";
import { isFunction } from "../../../common/helpers";
import { ComponentPropertyBindingStrategy } from "../bindings/strategies/component-property-binding-strategy";

/**
 * Represents component view.
 * Persists the DOM representation and tracks for component changes and triggers
 * change detection.
 */
export class ComponentView {
    children: ComponentView[] = [];
    presentation: HTMLElement;
    bindings = new Map<any, BindingStrategyBase<any>[]>();

    constructor(public parent: ComponentView, public component: Component) {
        const store = component.data as DataStore;
        store.registerOnChange((a, b, c) => this.update(a, b, c));
    }

    callLifecycleHook(hookName: string) {
        this.callLifecycleHookForChildren(this, hookName);
    }

    replacePresentation(newPresentation: HTMLElement) {
        this.presentation.innerHTML = "";
        this.presentation.appendChild(newPresentation);
    }

    private callLifecycleHookForChildren(view: ComponentView, hookName: string) {
        for (const child of view.children) {
            if (child instanceof ComponentView) {
                this.callLifecycleHookForChildren(child, hookName);
            }
        }

        const hook: Function = view.component[hookName];
        const shouldCallHook = hook && isFunction(hook);

        if (shouldCallHook) {
            hook.call(view.component);
        }
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