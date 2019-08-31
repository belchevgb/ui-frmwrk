import { Injectable } from "../../../di";
import { ComponentView } from "../presentation/view";
import { Node, TextNode, ElementNode, TextNodeType, InterpolationNode } from "../parser/parser";
import { Renderer } from "../presentation/renderer";
import { TextBindingStrategy } from "./strategies/text-strategy";

@Injectable
export class BindingProcessor {
    constructor(private renderer: Renderer) {}

    setBindings(node: Node, nodeElement: HTMLElement, parentElement: HTMLElement, view: ComponentView) {
        this.trySetTextBinding(node, view, parentElement);
    }

    private trySetTextBinding(node: Node, view: ComponentView, parentElement: HTMLElement) {
        if (node instanceof InterpolationNode) {
            const textNode = this.renderer.createText("");
            const property = node.value;
            const strategy = new TextBindingStrategy(textNode, property, view.component);

            if (!view.bindings.has(property)) {
                view.bindings.set(property, []);
            }

            const strategies = view.bindings.get(property);
            strategies.push(strategy);
            parentElement.appendChild(textNode);
        }
    }
}