import { BindingStrategyBase } from "./binding-strategy.base";

export class TextBindingStrategy extends BindingStrategyBase<Text> {
    constructor(element: Text) {
        super(element as any);
    }

    update(value: string): void {
        if (value === null || value === undefined) {
            value = "";
        }

        this.element.nodeValue = value;
    }
}