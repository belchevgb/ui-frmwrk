import { IAttributeToken } from "../lexer/token";
import { Injectable, Inject } from "../../../di";
import { AttributeNode } from "../parser/parser";

/**
 * Handles DOM elements creation.
 */
@Injectable
export class Renderer {
    /**
     * Creates HTML element.
     * @param name The tag name of the element.
     * @param attributes Attributes which will be applied to the element.
     */
    createElement(name: string, attributes: AttributeNode[] = []): HTMLElement {
        const element = document.createElement(name);
        attributes.forEach(a => element.setAttribute(a.key, a.value));

        return element;
    }

    /**
     * Creates text content element.
     * @param data The content of the text node.
     */
    createText(data: string) {
        return document.createTextNode(data);
    }

    /**
     * Creates comment element.
     * @param data The comment's content.
     */
    createComment(data: string) {
        return document.createComment(data);
    }
}