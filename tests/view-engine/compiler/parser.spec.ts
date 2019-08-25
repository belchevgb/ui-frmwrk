import { Parser, Node, ElementNode, TextNode, ComponentViewNode, TextNodeType, ComponentDef, IComponentRegistration } from "../../../src";
import { resolve } from "../../../src/di";

describe("Parser tests", () => {
    it("should return correct ast", () => {
        @ComponentDef({ selector: "component-selector", template: ""})
        class CustomComponent { }

        const html = `
            <div>
                <!-- cooment -->
                <component-selector></component-selector>
                <h1>
                    <br />
                    text content
                </h1>
            </div>
        `;

        const parser: Parser = resolve(Parser);
        const ast: Node = parser.parse(html);
        const children = ast.children;

        const divNode = children[0] as ElementNode;
        const commentNode = divNode.children[0] as TextNode;
        const componentNode = divNode.children[1] as ComponentViewNode;
        const h1Node = divNode.children[2] as ElementNode;
        const brNode = h1Node.children[0] as ElementNode;
        const contentNode = h1Node.children[1] as TextNode;

        verifyElementNode(divNode, "div", ast);
        verifyTextNode(commentNode, TextNodeType.Comment, "cooment", divNode);
        verifyComponentViewNode(componentNode, "component-selector", { componentType: CustomComponent, template: "" }, divNode);
        verifyElementNode(h1Node, "h1", divNode);
        verifyElementNode(brNode, "br", h1Node);
        verifyTextNode(contentNode, TextNodeType.Content, "text content", h1Node);
    });

    function verifyElementNode(node: ElementNode, expectedName: string, expectedParent: Node) {
        expect(node instanceof ElementNode).toBe(true);
        expect(node.name).toEqual(expectedName);
        expect(node.parent).toBe(expectedParent);
    }

    function verifyTextNode(node: TextNode, expectedType: TextNodeType, expectedText: string, expectedParent: Node) {
        expect(node instanceof TextNode).toBe(true);
        expect(node.type).toEqual(expectedType);
        expect(node.value.trim()).toEqual(expectedText);
        expect(node.parent).toEqual(expectedParent);
    }

    function verifyComponentViewNode(node: ComponentViewNode, expectedSelector: string, expectedReg: IComponentRegistration, expectedParent: Node) {
        expect(node instanceof ComponentViewNode).toBe(true);
        expect(node.selector).toEqual(expectedSelector);
        expect(node.compReg).toEqual(expectedReg);
        expect(node.parent).toEqual(expectedParent);
    }
});
