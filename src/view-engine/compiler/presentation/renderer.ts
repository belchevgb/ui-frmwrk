import { IAttribute } from "../lexer/token";
import { Injectable } from "../../../di";

@Injectable
export class Renderer {
    createElement(name: string, attributes: IAttribute[] = []): HTMLElement {
        const element = document.createElement(name);
        attributes.forEach(a => element.setAttribute(a.key, a.value));

        return element;
    }

    createText(data: string) {
        return document.createTextNode(data);
    }

    createComment(data: string) {
        return document.createComment(data);
    }
}