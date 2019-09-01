import { Component, ComponentDef, ViewBuilder } from "../../src";
import { resolve } from "../../src/di";

const CLOCK_TICK_TIMEOUT = 1000;

describe("Change detection and bindings tests", () => {
    beforeAll(() => {
    });

    beforeEach(() => {
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it("Should update text interpolation properly", () => {
        @ComponentDef({
            selector: "component",
            template: `
                <button (click)="count"></button>
                <div>{{counter}}</div>
            `
        })
        class SimpleComponent extends Component {
            constructor() {
                super();
                this.data.counter = 0;
            }

            count() {
                this.data.counter++;
            }
        }

        const viewBuilder: ViewBuilder = resolve(ViewBuilder);
        const view = viewBuilder.createView(SimpleComponent);
        const button = view.presentation.getElementsByTagName("button")[0];
        const div = view.presentation.getElementsByTagName("div")[0];

        for (let i = 1; i <= 5; i++) {
            button.click();
            jasmine.clock().tick(CLOCK_TICK_TIMEOUT);
            expect(div.innerText.trim()).toEqual(`${i}`);
        }
    });

    it("Should update attribute interpolation properly", () => {
        @ComponentDef({
            selector: "component",
            template: `
                <button (click)="count"></button>
                <div attr="{{counter}}"></div>
            `
        })
        class SimpleComponent extends Component {
            constructor() {
                super();
                this.data.counter = 0;
            }

            count() {
                this.data.counter++;
            }
        }

        const viewBuilder: ViewBuilder = resolve(ViewBuilder);
        const view = viewBuilder.createView(SimpleComponent);
        const button = view.presentation.getElementsByTagName("button")[0];
        const div = view.presentation.getElementsByTagName("div")[0];

        for (let i = 1; i <= 5; i++) {
            button.click();
            jasmine.clock().tick(CLOCK_TICK_TIMEOUT);
            expect(div.getAttribute("attr")).toEqual(`${i}`);
        }
    });
});