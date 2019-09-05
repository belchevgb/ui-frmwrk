import { ComponentDef, ViewBuilder, Component } from "../../src";
import { resolve } from "../../src/di";
import { TextBindingStrategy } from "../../src/view-engine/compiler/bindings/strategies/text-strategy";
import { EventBindingStrategy } from "../../src/view-engine/compiler/bindings/strategies/event-strategy";
import { ComponentEventBindingStrategy } from "../../src/view-engine/compiler/bindings/strategies/component-event-binding-strategy";
import { ComponentEvent } from "../../src/view-engine/compiler/presentation/component-event";
import { ComponentPropertyBindingStrategy } from "../../src/view-engine/compiler/bindings/strategies/component-property-binding-strategy";
import { App } from "../../src/app";

describe("ViewBuilder tests", () => {
    beforeEach(() => {
        App.reinit();
    });

    it("should return correct presentation", () => {
        @ComponentDef({ selector: "component-selector", template: "<div></div>"})
        class CustomComponent extends Component { }

        @ComponentDef({ selector: "other-selector", template: "<div><component-selector></component-selector></div>" })
        class OtherComponent extends Component { }

        App.registerComponents([CustomComponent, OtherComponent]);

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

        App.registerComponents([CustomComponent]);

        const builder: ViewBuilder = resolve(ViewBuilder);
        const view = builder.createView(CustomComponent);
        const bindings = view.bindings.get("prop");

        expect(bindings.length).toEqual(1);
        expect(bindings[0] instanceof TextBindingStrategy);
    });

    it("should process attribute interpolation correctly", () => {
        @ComponentDef({ selector: "component-selector", template: `<div someAttr="key1 {{prop}} key2"></div>`})
        class CustomComponent extends Component { }

        App.registerComponents([CustomComponent]);

        const builder: ViewBuilder = resolve(ViewBuilder);
        const view = builder.createView(CustomComponent);
        const bindings = view.bindings.get("prop");

        expect(bindings.length).toEqual(1);
        expect(bindings[0] instanceof TextBindingStrategy);

        const divElement = view.presentation.children[0];
        const attribute = divElement.getAttribute("someAttr");

        expect(attribute.includes("{{prop}}")).toBe(false);
    });

    it("should process event binding correctly", () => {
        @ComponentDef({ selector: "component-selector", template: `<div (click)="handler"></div>`})
        class CustomComponent extends Component { }

        App.registerComponents([CustomComponent]);

        const builder: ViewBuilder = resolve(ViewBuilder);
        const view = builder.createView(CustomComponent);
        const bindings = view.bindings.get("click");

        expect(bindings.length).toEqual(1);
        expect(bindings[0] instanceof EventBindingStrategy);
    });

    it("should process component event and property bindings correctly", () => {
        @ComponentDef({ selector: "component-selector", template: "<div></div>"})
        class CustomComponent extends Component {
            click = new ComponentEvent();
        }

        @ComponentDef({ selector: "other-selector", template: `<component-selector (click)="onClick" childProp="parentProp"></component-selector>` })
        class OtherComponent extends Component { }

        App.registerComponents([CustomComponent, OtherComponent]);

        const builder: ViewBuilder = resolve(ViewBuilder);
        const view = builder.createView(OtherComponent);
        const eventBindings = view.bindings.get("click_onClick");
        const propBindings = view.bindings.get("parentProp");

        expect(eventBindings.length).toEqual(1);
        expect(eventBindings[0] instanceof ComponentEventBindingStrategy).toBe(true);

        expect(propBindings.length).toEqual(1);
        expect(propBindings[0] instanceof ComponentPropertyBindingStrategy).toBe(true);
    });
});