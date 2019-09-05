import { Node, Parser, ElementNode, ComponentViewNode, TextNode, TextNodeType, InterpolationNode, AttributeNode, EventBindingNode } from "../parser/parser";
import { IComponentConfig, COMPONENT_CONFIG_MD_KEY, Component } from "./component";
import "reflect-metadata";
import { ComponentView } from "./view";
import { Renderer } from "./renderer";
import { Injectable, resolve, registerType } from "../../../di";
import { BindingProcessor } from "../bindings/binding-processor";

/**
 * Creates view objects.
 */
@Injectable
export class ViewBuilder {
    constructor(private parser: Parser, private renderer: Renderer, private bindingsProcessor: BindingProcessor) { }

    /**
     * Creates component view.
     * @param componentType The component type, for which a view will be created.
     * @param parent The parent view.
     */
    createView(componentType: any, parent: ComponentView = null) {
        const component: Component = resolve(componentType);
        const config: IComponentConfig = Reflect.getMetadata(COMPONENT_CONFIG_MD_KEY, componentType);
        const ast = this.parser.parse(config.template);
        const view = new ComponentView(parent, component);

        this.buildChildTree(ast, config, view);

        return view;
    }

    private buildChildTree(ast: Node, config: IComponentConfig, view: ComponentView) {
        const viewPresentation = this.renderer.createElement(config.selector);

        ast.children.forEach(c => this.createChild(c, view, viewPresentation));
        view.presentation = viewPresentation;
        view.component.view = view;
    }

    private createChild(ast: Node, view: ComponentView, parentElement: HTMLElement) {
        let node: any = this.renderer.createText("");

        if (ast instanceof ComponentViewNode) {
            node = this.createChildView(ast, view, parentElement);
        } else if (ast instanceof ElementNode) {
            node = this.createChildElement(ast, view, parentElement);
        } else if (ast instanceof TextNode) {
            node = this.createTextElement(ast);
        }

        if (!(ast instanceof InterpolationNode)) {
            this.traverseChildren(ast, view, parentElement, node);
        }

        this.bindingsProcessor.setBindings(ast, node, parentElement, view);

        return node;
    }

    private traverseChildren(ast: Node, view: ComponentView, parentElement: HTMLElement, node: HTMLElement) {
        parentElement.appendChild(node);

        for (const childNode of ast.children) {
            if (childNode instanceof AttributeNode || childNode instanceof EventBindingNode) {
                continue;
            }

            const childPresentation = this.createChild(childNode, view, node);
            node.appendChild(childPresentation);
        }
    }

    private createChildView(ast: ComponentViewNode, view: ComponentView, parentElement: HTMLElement) {
        const childView = this.createView(ast.compReg.componentType, view);

        ast.children.forEach(c => {
            if (c instanceof AttributeNode) {
                this.bindingsProcessor.trySetComponentPropBinding(view, childView, c);
            } else if (c instanceof EventBindingNode) {
                this.bindingsProcessor.trySetComponentEventBinding(view, childView, c);
            }
        });

        view.children.push(childView);
        return childView.presentation;
    }

    private createChildElement(ast: ElementNode, view: ComponentView, parentElement: HTMLElement) {
        const node = this.renderer.createElement(ast.name);

        for (const ch of ast.children) {
            if (ch instanceof AttributeNode) {
                node.setAttribute(ch.key, ch.value);
            }

            if (ch instanceof EventBindingNode) {
                this.bindingsProcessor.trySetEventBinding(ch, node, view);
            }
        }

        return node;
    }

    private createTextElement(ast: TextNode) {
        const textNode: any = ast.type === TextNodeType.Comment ? this.renderer.createComment(ast.value) : this.renderer.createText(ast.value);
        return textNode;
    }
}
