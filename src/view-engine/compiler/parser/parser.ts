import { Lexer } from "../lexer/lexer";
import { TokenType, ITagToken, IAttribute, IStringToken } from "../lexer/token";
import { ComponentStore, IComponentRegistration } from "../presentation/component";
import { Injectable } from "../../../di";

export class Node {
    public children: Node[] = [];

    constructor(public parent: Node) { }
}

export class ElementNode extends Node {
    constructor(public parent: Node, public name: string, public attributes: IAttribute[]) {
        super(parent);
    }
}

export const enum TextNodeType {
    Content,
    Comment
}

export class ComponentViewNode extends Node {
    constructor(public parent: Node, public selector: string, public compReg: IComponentRegistration) {
        super(parent);
    }
}

export class TextNode extends Node {
    constructor(public parent: Node, public value: string, public type: TextNodeType) {
        super(parent);
    }
}

@Injectable
export class Parser {
    constructor(private lexer: Lexer, private compStore: ComponentStore) { }

    parse(template: string) {
        this.lexer.init(template);

        const root = new Node(null);
        let token = this.lexer.nextToken();
        let currentNode = root;

        while (token.type !== TokenType.End) {
            switch (token.type) {
                case TokenType.SelfclosingTag:
                    this.createChildElementNode(currentNode, token as ITagToken);
                    break;

                case TokenType.OpenTag:
                    currentNode = this.createChildElementNode(currentNode, token as ITagToken);
                    break;

                case TokenType.CloseTag:
                    currentNode = currentNode.parent ? currentNode.parent : currentNode;
                    break;

                case TokenType.Comment:
                    this.createTextNode(currentNode, token as IStringToken, TextNodeType.Comment);
                    break;

                case TokenType.Content:
                    this.createTextNode(currentNode, token as IStringToken, TextNodeType.Content);
                    break;
            }

            token = this.lexer.nextToken();
        }

        return root;
    }

    private createTextNode(parent: Node, token: IStringToken, type: TextNodeType) {
        const child = new TextNode(parent, token.value, type);
        parent.children.push(child);
    }

    private createChildElementNode(parent: Node, token: ITagToken) {
        const compReg = this.compStore.getRegistration(token.name);
        let child: Node;

        if (compReg) {
            child = new ComponentViewNode(parent, token.name, compReg);
        } else {
            child = new ElementNode(parent, token.name, token.attributes || []);
        }

        if (parent) {
            parent.children.push(child);
        }

        return child;
    }
}