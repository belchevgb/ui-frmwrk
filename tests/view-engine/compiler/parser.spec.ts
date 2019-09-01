import { Parser, Node, ElementNode, TextNode, ComponentViewNode, TextNodeType, ComponentDef, IComponentRegistration, InterpolationNode, AttributeNode, EventBindingNode } from "../../../src";
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

    it("should handle interpolation", () => {
        const html = "<div>text {{interpolation}} text</div>";
        const parser: Parser = resolve(Parser);
        const ast: Node = parser.parse(html);

        const divNode = ast.children[0];
        const firstTextNode = divNode.children[0];
        const interpolationNode = divNode.children[1];
        const secondTextNode = divNode.children[2];

        expect(divNode instanceof ElementNode).toBe(true);
        expect(firstTextNode instanceof TextNode).toBe(true);
        expect(interpolationNode instanceof InterpolationNode).toBe(true);
        expect(secondTextNode instanceof TextNode).toBe(true);
    });

    it("should handle attribute", () => {
        const html = `<div attr="attr" otherAttr></div>`;
        const parser: Parser = resolve(Parser);
        const ast: Node = parser.parse(html);

        const divNode = ast.children[0];
        const firstAttr = divNode.children[0];
        const secondAttr = divNode.children[1];

        expect(divNode instanceof ElementNode).toBe(true);
        expect(firstAttr instanceof AttributeNode).toBe(true);
        expect(secondAttr instanceof AttributeNode).toBe(true);
    });

    it("should process event binding", () => {
        const html = `<div (evName)="eventHandler" otherAttr></div>`;
        const parser: Parser = resolve(Parser);

        const ast: Node = parser.parse(html);

        const divNode = ast.children[0];
        const eventBinding = divNode.children[0] as EventBindingNode;

        expect(divNode instanceof ElementNode).toBe(true);
        expect(eventBinding instanceof EventBindingNode).toBe(true);
        expect(eventBinding.eventName).toEqual("evName");
        expect(eventBinding.eventHandlerName).toEqual("eventHandler");
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
