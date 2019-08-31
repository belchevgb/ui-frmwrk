import { AttributeBindingStrategy } from "../../../src/view-engine/compiler/bindings/strategies/attribute-strategy";
import { TextBindingStrategy } from "../../../src/view-engine/compiler/bindings/strategies/text-strategy";

describe("Binding strategies tests", () => {
    describe("Attribute strategy", () => {
        it("should update attribute value correctly", () => {
            const element = document.createElement("div");
            const attrName = "customAttr";
            element.setAttribute(attrName, "val");

            const strategy = new AttributeBindingStrategy(element, attrName);
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

            const strategy = new AttributeBindingStrategy(element, attrName);
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
            const strategy = new TextBindingStrategy(textNode);
            let val = "val";

            strategy.update(val);
            expect(textNode.nodeValue).toEqual(val);

            val = "val2";

            strategy.update(val);
            expect(textNode.nodeValue).toEqual(val);
        });
    });
});