import { resolve, registerType, clearCachedObjects } from "./di";

import { ViewBuilder } from "./exports";

import { Type, Component } from "./view-engine/compiler/presentation/component";
import { IRoute } from "./routing/interfaces";
import { RoutingManager as RoutingManager } from "./routing/routing-manager";
import { initRoutingDI } from "./routing/register.services";
import { initViewEngineDI } from "./view-engine/register.services";

export class App {
    static reinit() {
        clearCachedObjects();
        App.initServices();
    }

    static initServices() {
        initRoutingDI();
        initViewEngineDI();
    }

    static registerComponents(components: Type<Component>[]) {
        components.forEach(c => registerType(c));
    }

    static registerRoutes(routes: IRoute[]) {
        const routingManager: RoutingManager = resolve(RoutingManager);
        routingManager.registerRoutes(routes);
    }

    static start(rootComponentType: Type<any>, rootElementSelector: string) {
        const element = document.getElementById(rootElementSelector);
        const builder: ViewBuilder = resolve(ViewBuilder);
        const mainView = builder.createView(rootComponentType);

        element.appendChild(mainView.presentation);
    }
}
