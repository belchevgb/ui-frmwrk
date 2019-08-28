import { Injectable } from "../../../di";
import { ComponentView } from "../presentation/view";
import { Node, TextNode, ElementNode, TextNodeType, InterpolationNode } from "../parser/parser";

@Injectable
export class BindingProcessor {
    setBindings(node: Node, nodeElement: HTMLElement, parentElement: HTMLElement, view: ComponentView) {
        if (node instanceof InterpolationNode) {
            
        }
    }
}