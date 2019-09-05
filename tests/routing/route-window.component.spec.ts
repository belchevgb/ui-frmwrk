import { ViewBuilder, ComponentDef, Component } from "../../src";
import { resolve, clearCachedObjects } from "../../src/di";
import { RouteWindowComponent } from "../../src/routing/route-window.component";
import { RoutingManager, defaultRouteWindowName } from "../../src/routing/routing-manager";
import { lifecycleHookNames, IComponentInit, IComponentDestroy } from "../../src/view-engine/compiler/presentation/lifecycle-hooks";
import { App } from "../../src/app";

describe("RouteWindowComponent tests", () => {
    beforeEach(() => {
        App.reinit();
    });

    it("should self register with correct name", () => {
        const viewBuilder: ViewBuilder = resolve(ViewBuilder);

        const template = `
            <route-window></route-window>
            <route-window name="second-window"></route-window>
        `;
        @ComponentDef({selector: "appcomp", template })
        class AppComponent extends Component {}

        App.registerComponents([AppComponent]);

        const view = viewBuilder.createView(AppComponent);
        view.callLifecycleHook(lifecycleHookNames.onComponentInit);

        const manager: RoutingManager = resolve(RoutingManager);

        expect(manager.routeWindows.get(defaultRouteWindowName) instanceof RouteWindowComponent).toBe(true);
        expect(manager.routeWindows.get("second-window") instanceof RouteWindowComponent).toBe(true);
    });

    it("should replace view correctly and call lifecycle hooks", () => {
        @ComponentDef({selector: "first", template: "<div></div>" })
        class FirstComponent extends Component implements IComponentInit, IComponentDestroy {
            onComponentDestroy(): void {
            }
            onComponentInit(): void {
            }
        }

        @ComponentDef({selector: "second", template: "<div></div>" })
        class SecondComponent extends Component implements IComponentInit {
            onComponentInit(): void {
            }
        }

        App.registerComponents([FirstComponent, SecondComponent]);

        const viewBuilder: ViewBuilder = resolve(ViewBuilder);
        const routeWindow = viewBuilder.createView(RouteWindowComponent).component as RouteWindowComponent;
        const firstCompView = viewBuilder.createView(FirstComponent);
        const secondCompView = viewBuilder.createView(SecondComponent);

        const firstComp = firstCompView.component as FirstComponent;
        const secondComp = secondCompView.component as SecondComponent;

        const firstCompInit = spyOn(firstComp, "onComponentInit");
        const firstCompDestr = spyOn(firstComp, "onComponentDestroy");
        const secondCompInit = spyOn(secondComp, "onComponentInit");

        routeWindow.setView(firstCompView);
        expect(firstCompInit).toHaveBeenCalled();
        expect(routeWindow.view.presentation.children.length).toEqual(1);
        expect(routeWindow.view.presentation.children[0].tagName.toLowerCase() === "first").toBe(true);

        routeWindow.setView(secondCompView);
        expect(firstCompDestr).toHaveBeenCalled();
        expect(secondCompInit).toHaveBeenCalled();
        expect(routeWindow.view.presentation.children.length).toEqual(1);
        expect(routeWindow.view.presentation.children[0].tagName.toLowerCase() === "second").toBe(true);
    });
});