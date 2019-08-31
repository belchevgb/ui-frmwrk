import { Injectable } from "../../../di";
import { ComponentView } from "../presentation/view";
import { Node, TextNode, ElementNode, TextNodeType, InterpolationNode } from "../parser/parser";
import { Renderer } from "../presentation/renderer";
import { TextBindingStrategy } from "./strategies/text-strategy";
import { AttributeBindingStrategy } from "./strategies/attribute-strategy";

const INTERPOLATION_PATTERN = /{{[a-z0-9]+}}/i;
const INTERPOLATION_BRACKETS = ["{{", "}}"];

@Injectable
export class BindingProcessor {
    constructor(private renderer: Renderer) {}

    setBindings(node: Node, nodeElement: HTMLElement, parentElement: HTMLElement, view: ComponentView) {
        this.trySetTextBinding(node, view, parentElement);
        this.trySetAttributeBindings(node, nodeElement, parentElement, view);
    }

    private trySetAttributeBindings(node: Node, nodeElement: HTMLElement, parentElement: HTMLElement, view: ComponentView) {
        if (node instanceof ElementNode) {
            const attributes = nodeElement.getAttributeNames() || [];
            for (const attrName of attributes) {
                let attributeValue = nodeElement.getAttribute(attrName);
                const interpolationMatches = attributeValue.match(INTERPOLATION_PATTERN);

                for (let boundProperty of interpolationMatches) {
                    attributeValue = attributeValue.replace(boundProperty, "");
                    INTERPOLATION_BRACKETS.forEach(b => boundProperty = boundProperty.replace(b, ""));

                    const strategy = new AttributeBindingStrategy(nodeElement, attrName);
                    const strategies = this.getBindingStrategiesCollection(boundProperty, view);

                    strategies.push(strategy);
                    nodeElement.setAttribute(attrName, attributeValue);
                }
            }
        }
    }

    private trySetTextBinding(node: Node, view: ComponentView, parentElement: HTMLElement) {
        if (node instanceof InterpolationNode) {
            const textNode = this.renderer.createText("");
            const boundProperty = node.value;
            const strategy = new TextBindingStrategy(textNode);
            const strategies = this.getBindingStrategiesCollection(boundProperty, view);

            strategies.push(strategy);
            parentElement.appendChild(textNode);
        }
    }

    private getBindingStrategiesCollection(boundProperty: string, view: ComponentView) {
        if (!view.bindings.has(boundProperty)) {
            view.bindings.set(boundProperty, []);
        }

        return view.bindings.get(boundProperty);
    }
}