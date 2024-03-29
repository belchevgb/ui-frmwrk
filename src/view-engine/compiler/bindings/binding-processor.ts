import { Injectable, registerType } from "../../../di";
import { ComponentView } from "../presentation/view";
import { Node, ElementNode, InterpolationNode, EventBindingNode, AttributeNode } from "../parser/parser";
import { Renderer } from "../presentation/renderer";
import { TextBindingStrategy } from "./strategies/text-strategy";
import { AttributeBindingStrategy } from "./strategies/attribute-strategy";
import { EventBindingStrategy } from "./strategies/event-strategy";
import { ComponentEventBindingStrategy } from "./strategies/component-event-binding-strategy";
import { ComponentPropertyBindingStrategy } from "./strategies/component-property-binding-strategy";

const INTERPOLATION_PATTERN = /{{[a-z0-9]+}}/i;
const INTERPOLATION_BRACKETS = ["{{", "}}"];

/**
 * Processes the bound properties of a component to the view.
 */
@Injectable
export class BindingProcessor {
    constructor(private renderer: Renderer) {}

    setBindings(node: Node, nodeElement: HTMLElement, parentElement: HTMLElement, view: ComponentView) {
        this.trySetTextBinding(node, view, parentElement);
        this.trySetAttributeBindings(node, nodeElement, view);
    }

    trySetEventBinding(node: Node, nodeElement: HTMLElement, view: ComponentView) {
        if (node instanceof EventBindingNode) {
            const strategies = this.getBindingStrategiesCollection(node.eventName, view);
            const strategy = new EventBindingStrategy(nodeElement, view.component, node.eventName, node.eventHandlerName);

            strategies.push(strategy);
        }
    }

    trySetComponentEventBinding(view: ComponentView, childView: ComponentView, eventBinding: EventBindingNode) {
        const strategy = new ComponentEventBindingStrategy(view.component, eventBinding.eventName, eventBinding.eventHandlerName, childView.component);
        const key = `${eventBinding.eventName}_${eventBinding.eventHandlerName}`;
        const strategies = this.getBindingStrategiesCollection(key, view);

        strategies.push(strategy);
    }

    trySetComponentPropBinding(view: ComponentView, childView: ComponentView, propBinding: AttributeNode) {
        const strategy = new ComponentPropertyBindingStrategy(null, view.component, childView.component, propBinding.key, propBinding.value);
        const strategies = this.getBindingStrategiesCollection(propBinding.value, view);

        strategy.update(propBinding.value);
        strategies.push(strategy);
    }

    private trySetAttributeBindings(node: Node, nodeElement: HTMLElement, view: ComponentView) {
        if (node instanceof ElementNode) {
            const attributes = nodeElement.getAttributeNames() || [];
            for (const attrName of attributes) {
                let attributeValue = nodeElement.getAttribute(attrName);
                const interpolationMatches = attributeValue.match(INTERPOLATION_PATTERN);

                for (let boundProperty of interpolationMatches) {
                    attributeValue = attributeValue.replace(boundProperty, "");
                    INTERPOLATION_BRACKETS.forEach(b => boundProperty = boundProperty.replace(b, ""));

                    const strategy = new AttributeBindingStrategy(nodeElement, attrName, view.component);
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
            const strategy = new TextBindingStrategy(textNode, view.component);
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
