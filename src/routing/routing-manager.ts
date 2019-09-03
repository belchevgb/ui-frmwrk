import { Injectable, registerSingleton } from "../di";
import { IRoute, IPathData } from "./interfaces";
import { RouteParser } from "./route-parser";
import { Component, Type } from "../view-engine/compiler/presentation/component";
import { EventHub } from "../common/app-events/event-hub";
import { RouteMatched } from "../common/app-events/events/routing-events";

export interface IParsedRoute extends IPathData {
    component: Type<Component>;
}

@Injectable
export class RoutingManager {
    private routes: IParsedRoute[] = [];

    constructor(private routeParser: RouteParser, eventHub: EventHub) {
        eventHub.subscribe(RouteMatched, (route) => {
            this.displayMatchedRoute(route.data);
        });
    }

    registerRoutes(routes: IRoute[]) {
        routes = routes || [];

        for (const route of routes) {
            const pathData = this.routeParser.parse(route.path);
            this.routes.push({ ...pathData, component: route.component });
        }
    }

    getRoutes() {
        return this.routes;
    }

    private displayMatchedRoute(route: IParsedRoute) {
        // TODO: load view in the route window
    }
}

registerSingleton(RoutingManager);
