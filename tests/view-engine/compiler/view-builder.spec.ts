import { ComponentDef, ViewBuilder, Component } from "../../../src";
import { resolve } from "../../../src/di";

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
});