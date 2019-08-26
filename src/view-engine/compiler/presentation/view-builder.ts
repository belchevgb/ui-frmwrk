import { Node, Parser, ElementNode, ComponentViewNode, TextNode, TextNodeType } from "../parser/parser";
import { IComponentConfig, COMPONENT_CONFIG_MD_KEY, ComponentStore } from "./component";
import "reflect-metadata";
import { ComponentView } from "./view";
import { Renderer } from "./renderer";
import { Injectable, resolve } from "../../../di";

@Injectable
export class ViewBuilder {
    constructor(private parser: Parser, private renderer: Renderer) { }

    createView(componentType: any, parent: ComponentView = null) {
        const component = resolve(componentType);
        const config: IComponentConfig = Reflect.getMetadata(COMPONENT_CONFIG_MD_KEY, componentType);
        const elementsAst = this.parser.parse(config.template);
        const presentation = this.createPresentation(elementsAst, config);
        const view = new ComponentView(parent, component, presentation);

        return view;
    }

    private createPresentation(ast: Node, config: IComponentConfig) {
        const viewPresentation = this.renderer.createElement(config.selector);

        ast.children.forEach(c => {
            const child = this.createPresentationElement(c);
            viewPresentation.appendChild(child);
        });

        return viewPresentation;
    }

    private createPresentationElement(ast: Node) {
        let node: HTMLElement = null;

        if (ast instanceof ComponentViewNode) {
            node = this.createView(ast.compReg.componentType).presentation;
        } else if (ast instanceof ElementNode) {
            node = this.renderer.createElement(ast.name, ast.attributes);
        } else if (ast instanceof TextNode) {
            const textNode: any = ast.type === TextNodeType.Comment ? this.renderer.createComment(ast.value) : this.renderer.createText(ast.value);
            return textNode;
        }

        for (const childNode of ast.children) {
            const childPresentation = this.createPresentationElement(childNode);
            node.appendChild(childPresentation);
        }

        return node;
    }
}