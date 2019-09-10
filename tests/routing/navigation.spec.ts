import { RoutingManager } from "../../src/routing/routing-manager";
import { resolve, registerType, registerSingleton, clearCachedObjects } from "../../src/di";
import { ComponentDef, Component, JitViewResolver } from "../../src";
import { RouteWindowComponent } from "../../src/routing/route-window.component";
import { Router } from "../../src/routing/router";
import { lifecycleHookNames } from "../../src/view-engine/compiler/presentation/lifecycle-hooks";
import { dependencyStore } from "../../src/di/dependency-store";
import { NavigationLinkComponent } from "../../src/routing/navigation-link.component";
import { App } from "../../src/app";

describe("Navigation tests", () => {
    beforeEach(() => {
        App.reinit();
    });

    it("Should load correct components when route is matched", () => {
        @ComponentDef({selector: "first", template: "" })
        class FirstComponent extends Component {}

        @ComponentDef({selector: "second", template: "" })
        class SecondComponent extends Component {}

        @ComponentDef({selector: "third", template: "" })
        class ThirdComponent extends Component {}

        App.registerComponents([FirstComponent, SecondComponent, ThirdComponent]);

        const routingManager: RoutingManager = resolve(RoutingManager);

        routingManager.registerRoutes([
            { path: "first", component: FirstComponent },
            { path: "page/second", component: SecondComponent },
            { path: ":third/third", component: ThirdComponent }
        ]);

        const viewBuilder: JitViewResolver = resolve(JitViewResolver);
        const routeWindow = viewBuilder.getView(RouteWindowComponent);
        routeWindow.callLifecycleHook(lifecycleHookNames.onComponentInit);

        const router: Router = resolve(Router);

        router.navigate("first");
        verifyComponentInRouteWindow(routeWindow.component, "first");

        router.navigate("page/second");
        verifyComponentInRouteWindow(routeWindow.component, "second");

        router.navigate("profile/third");
        verifyComponentInRouteWindow(routeWindow.component, "third");
    });

    it("Should load correct components in named route", () => {
        @ComponentDef({selector: "first", template: "" })
        class FirstComponent extends Component {}

        @ComponentDef({selector: "second", template: "" })
        class SecondComponent extends Component {}

        @ComponentDef({selector: "app", template: `<route-window name="second-window"></route-window><route-window></route-window>` })
        class AppComponent extends Component {}

        App.registerComponents([FirstComponent, SecondComponent, AppComponent]);

        const routingManager: RoutingManager = resolve(RoutingManager);

        routingManager.registerRoutes([
            { path: "first", component: FirstComponent, routeWindowName: "second-window" },
            { path: "page/second", component: SecondComponent, routeWindowName: "second-window" }
        ]);

        const viewBuilder: JitViewResolver = resolve(JitViewResolver);
        const appView = viewBuilder.getView(AppComponent);
        appView.callLifecycleHook(lifecycleHookNames.onComponentInit);

        const namedRouteView = appView.children.find(x => x.component instanceof RouteWindowComponent && x.component.data.name === "second-window");
        const router: Router = resolve(Router);

        router.navigate("first");
        verifyComponentInRouteWindow(namedRouteView.component, "first");

        router.navigate("page/second");
        verifyComponentInRouteWindow(namedRouteView.component, "second");
    });

    it("NavigationLinkComponent should perform correct navigation", () => {
        @ComponentDef({selector: "first", template: "" })
        class FirstComponent extends Component {}

        @ComponentDef({selector: "app", template: `<navigation-link path="home"></navigation-link><route-window></route-window>` })
        class AppComponent extends Component {}

        App.registerComponents([FirstComponent, AppComponent]);

        const routingManager: RoutingManager = resolve(RoutingManager);

        routingManager.registerRoutes([
            { path: "home", component: FirstComponent }
        ]);

        const viewBuilder: JitViewResolver = resolve(JitViewResolver);
        const appView = viewBuilder.getView(AppComponent);
        appView.callLifecycleHook(lifecycleHookNames.onComponentInit);

        const navLink = appView.presentation.getElementsByTagName("navigation-link")[0] as HTMLElement;
        const routeWindow = appView.children.find(x => x.component instanceof RouteWindowComponent);

        navLink.click();
        verifyComponentInRouteWindow(routeWindow.component, "first");
    });

    function verifyComponentInRouteWindow(routeWindow: Component, componentSelector: string) {
        const pres = routeWindow.view.presentation;

        expect(pres.children.length).toEqual(1);
        expect(pres.children[0].tagName.toLowerCase()).toEqual(componentSelector);
    }
});