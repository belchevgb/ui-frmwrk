import { AttributeBindingStrategy } from "../../src/view-engine/compiler/bindings/strategies/attribute-strategy";
import { TextBindingStrategy } from "../../src/view-engine/compiler/bindings/strategies/text-strategy";
import { EventBindingStrategy } from "../../src/view-engine/compiler/bindings/strategies/event-strategy";
import { Component } from "../../src";

const CLOCK_TIMEOUT = 2000;

describe("Binding strategies tests", () => {
    describe("Attribute strategy", () => {
        it("should update attribute value correctly", () => {
            const element = document.createElement("div");
            const attrName = "customAttr";
            element.setAttribute(attrName, "val");

            const strategy = new AttributeBindingStrategy(element, attrName, null);
            let newVal = "newVal";

            strategy.update(newVal);

            let attr = element.getAttribute(attrName);

            expect(attr).toEqual(`val ${newVal}`);

            newVal = "newVal2";
            strategy.update(newVal);
            attr = element.getAttribute(attrName);

            expect(attr).toEqual(`val ${newVal}`);
        });

        it("should update single value attribute", () => {
            const element = document.createElement("div");
            const attrName = "customAttr";
            element.setAttribute(attrName, "");

            const strategy = new AttributeBindingStrategy(element, attrName, null);
            let newVal = "newVal";

            strategy.update(newVal);

            let attr = element.getAttribute(attrName);

            expect(attr).toEqual(`${newVal}`);

            newVal = "newVal2";
            strategy.update(newVal);
            attr = element.getAttribute(attrName);

            expect(attr).toEqual(`${newVal}`);
        });
    });

    describe("Text binding strategy", () => {
        it("Should update text node", () => {
            const textNode = document.createTextNode("");
            const strategy = new TextBindingStrategy(textNode, null);
            let val = "val";

            strategy.update(val);
            expect(textNode.nodeValue).toEqual(val);

            val = "val2";

            strategy.update(val);
            expect(textNode.nodeValue).toEqual(val);
        });
    });

    describe("Event binding strategy", () => {
        beforeEach(() => {
            jasmine.clock().install();
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });

        it("should call component methods, when event is fired", () => {
            class CustomComponent extends Component {
                clickHandler() {
                }
            }

            const element = document.createElement("div");
            const component = new CustomComponent();
            const spy = spyOn(component, "clickHandler");
            const _ = new EventBindingStrategy(element, component, "click", "clickHandler");

            element.click();
            jasmine.clock().tick(CLOCK_TIMEOUT);

            expect(spy).toHaveBeenCalled();
        });

        it("should not throw if there isn't such method on the component", () => {
            class CustomComponent extends Component {
                clickHandler() {
                }
            }

            const element = document.createElement("div");
            const component = new CustomComponent();
            const spy = spyOn(component, "clickHandler");
            const _ = new EventBindingStrategy(element, component, "click", "clickHandler2");

            expect(() => {
                element.click();
                jasmine.clock().tick(CLOCK_TIMEOUT);
            }).not.toThrow();

            expect(spy).not.toHaveBeenCalled();

        });
    });
});