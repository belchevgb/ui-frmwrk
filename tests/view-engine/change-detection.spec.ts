import { Component, ComponentDef, JitViewResolver } from "../../src";
import { resolve } from "../../src/di";
import { ComponentEvent } from "../../src/view-engine/compiler/presentation/component-event";
import { App } from "../../src/app";

const CLOCK_TICK_TIMEOUT = 1000;

describe("Change detection and bindings tests", () => {
    beforeEach(() => {
        App.reinit();
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

        App.registerComponents([SimpleComponent]);

        const viewBuilder: JitViewResolver = resolve(JitViewResolver);
        const view = viewBuilder.getView(SimpleComponent);
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

        App.registerComponents([SimpleComponent]);

        const viewBuilder: JitViewResolver = resolve(JitViewResolver);
        const view = viewBuilder.getView(SimpleComponent);
        const button = view.presentation.getElementsByTagName("button")[0];
        const div = view.presentation.getElementsByTagName("div")[0];

        for (let i = 1; i <= 5; i++) {
            button.click();
            jasmine.clock().tick(CLOCK_TICK_TIMEOUT);
            expect(div.getAttribute("attr")).toEqual(`${i}`);
        }
    });

    it("component event binding should work correctly", () => {
        const eventText = "button clicked";

        @ComponentDef({ selector: "component-selector", template: `<button (click)="buttonClicked">Trigger event</button>`})
        class CustomComponent extends Component {
            click = new ComponentEvent();

            buttonClicked() {
                this.click.raise(eventText);
            }
        }

        @ComponentDef({ selector: "other-selector", template: `<component-selector (click)="onClick"></component-selector><span>{{text}}</span>` })
        class OtherComponent extends Component {
            onClick(text: string) {
                this.data.text = text;
            }
        }

        App.registerComponents([CustomComponent, OtherComponent]);

        const viewBuilder: JitViewResolver = resolve(JitViewResolver);
        const view = viewBuilder.getView(OtherComponent);

        const button = view.presentation.getElementsByTagName("button")[0];
        const span = view.presentation.getElementsByTagName("span")[0];

        button.click();
        jasmine.clock().tick(CLOCK_TICK_TIMEOUT);

        expect(span.innerText.trim()).toEqual(eventText);
    });

    it("component property binding should work correctly", () => {
        const propChangedText = "prop changed";

        @ComponentDef({ selector: "component-selector", template: `<span>{{boundProp}}</span>`})
        class CustomComponent extends Component {}

        @ComponentDef({ selector: "other-selector", template: `<component-selector boundProp="parentProp"></component-selector><button (click)="onClick">Trigger property change</button>` })
        class OtherComponent extends Component {
            onClick() {
                this.data.parentProp = propChangedText;
            }
        }

        App.registerComponents([CustomComponent, OtherComponent]);

        const viewBuilder: JitViewResolver = resolve(JitViewResolver);
        const view = viewBuilder.getView(OtherComponent);
        const span = view.presentation.getElementsByTagName("span")[0];
        const button = view.presentation.getElementsByTagName("button")[0];

        button.click();
        jasmine.clock().tick(CLOCK_TICK_TIMEOUT);
        expect(span.innerText.trim()).toEqual(propChangedText);
    });
});