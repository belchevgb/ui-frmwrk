import { Node, Parser, ElementNode, ComponentViewNode, TextNode, TextNodeType, InterpolationNode, AttributeNode, EventBindingNode } from "../parser/parser";
import { IComponentConfig, COMPONENT_CONFIG_MD_KEY, ComponentStore } from "./component";
import "reflect-metadata";
import { ComponentView } from "./view";
import { Renderer } from "./renderer";
import { Injectable, resolve } from "../../../di";
import { BindingProcessor } from "../bindings/binding-processor";

@Injectable
export class ViewBuilder {
    constructor(private parser: Parser, private renderer: Renderer, private bindingsProcessor: BindingProcessor) { }

    createView(componentType: any, parent: ComponentView = null) {
        const component = resolve(componentType);
        const config: IComponentConfig = Reflect.getMetadata(COMPONENT_CONFIG_MD_KEY, componentType);
        const elementsAst = this.parser.parse(config.template);
        const view = new ComponentView(parent, component);
        const presentation = this.buildChildTree(elementsAst, config, view);

        view.presentation = presentation;
        return view;
    }

    private buildChildTree(ast: Node, config: IComponentConfig, view: ComponentView) {
        const viewPresentation = this.renderer.createElement(config.selector);

        ast.children.forEach(c => this.createChildElement(c, view, viewPresentation));

        return viewPresentation;
    }

    private createChildElement(ast: Node, view: ComponentView, parentElement: HTMLElement) {
        let node: any = this.renderer.createText("");

        if (ast instanceof ComponentViewNode) {
            const childView = this.createView(ast.compReg.componentType);

            view.children.push(childView);
            node = childView.presentation;
        } else if (ast instanceof ElementNode) {
            const attributes = ast.children.filter(c => c instanceof AttributeNode) as AttributeNode[];
            const eventBindings = ast.children.filter(c => c instanceof EventBindingNode) as EventBindingNode[];

            node = this.renderer.createElement(ast.name, attributes);
            eventBindings.forEach(b => this.bindingsProcessor.trySetEventBindings(b, node, view));
        } else if (ast instanceof TextNode && ast.type === TextNodeType.Comment) {
            const textNode: any = ast.type === TextNodeType.Comment ? this.renderer.createComment(ast.value) : this.renderer.createText(ast.value);
            node = textNode;
        }

        if (!(ast instanceof InterpolationNode)) {
            parentElement.appendChild(node);

            for (const childNode of ast.children) {
                if (childNode instanceof AttributeNode || childNode instanceof EventBindingNode) {
                    continue;
                }

                const childPresentation = this.createChildElement(childNode, view, node);
                node.appendChild(childPresentation);
            }
        }

        this.bindingsProcessor.setBindings(ast, node, parentElement, view);

        return node;
    }
}