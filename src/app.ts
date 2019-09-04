import { resolve } from "./di";

import { ViewBuilder } from "./exports";

import { Type } from "./view-engine/compiler/presentation/component";
import { IRoute } from "./routing/interfaces";
import { RoutingManager as RoutingManager } from "./routing/routing-manager";

const ROOT_ELEMENT_SELECTOR = "app";

export class App {
    static registerRoutes(routes: IRoute[]) {
        const routingManager: RoutingManager = resolve(RoutingManager);
        routingManager.registerRoutes(routes);
    }

    static start(rootComponentType: Type<any>) {
        const element = document.getElementById(ROOT_ELEMENT_SELECTOR);
        const builder: ViewBuilder = resolve(ViewBuilder);
        const mainView = builder.createView(rootComponentType);
    
        element.appendChild(mainView.presentation);
    }
}
