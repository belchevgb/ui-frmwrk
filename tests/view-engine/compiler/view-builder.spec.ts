import { ComponentDef, ViewBuilder, Component } from "../../../src";
import { resolve } from "../../../src/di";
import { TextBindingStrategy } from "../../../src/view-engine/compiler/bindings/strategies/text-strategy";

describe("ViewBuilder tests", () => {
    it("should return correct presentation", () => {
        @ComponentDef({ selector: "component-selector", template: "<div></div>"})
        class CustomComponent extends Component { }

        @ComponentDef({ selector: "other-selector", template: "<div><component-selector></component-selector></div>" })
        class OtherComponent extends Component { }

        const builder: ViewBuilder = resolve(ViewBuilder);
        const presentation = builder.createView(OtherComponent).presentation;

        const rootElement = presentation;
        const divElement = rootElement.firstElementChild;
        const innerComponent = divElement.firstElementChild;
        const componentChild = innerComponent.firstElementChild;

        expect(rootElement.tagName.toLowerCase()).toEqual("other-selector");
        expect(divElement.tagName.toLowerCase()).toEqual("div");
        expect(innerComponent.tagName.toLowerCase()).toEqual("component-selector");
        expect(componentChild.tagName.toLowerCase()).toEqual("div");
    });

    it("should process text interpolation correctly", () => {
        @ComponentDef({ selector: "component-selector", template: "<div>text {{prop}} text</div>"})
        class CustomComponent extends Component { }

        const builder: ViewBuilder = resolve(ViewBuilder);
        const view = builder.createView(CustomComponent);
        const bindings = view.bindings.get("prop");

        expect(bindings.length).toEqual(1);
        expect(bindings[0] instanceof TextBindingStrategy);
    });

    it("should process attribute interpolation correctly", () => {
        @ComponentDef({ selector: "component-selector", template: `<div someAttr="key1 {{prop}} key2"></div>`})
        class CustomComponent extends Component { }

        const builder: ViewBuilder = resolve(ViewBuilder);
        const view = builder.createView(CustomComponent);
        const bindings = view.bindings.get("prop");

        expect(bindings.length).toEqual(1);
        expect(bindings[0] instanceof TextBindingStrategy);

        const divElement = view.presentation.children[0];
        const attribute = divElement.getAttribute("someAttr");

        expect(attribute.includes("{{prop}}")).toBe(false);
    });
});