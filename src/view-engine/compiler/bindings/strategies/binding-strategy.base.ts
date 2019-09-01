import { Component } from "../../presentation/component";

/**
 * Base strategy that defines the required data and interface for update strategy.
 */
export abstract class BindingStrategyBase<T> {
    constructor(protected element: T, protected component: Component) { }

    abstract update(value: any): void;
}