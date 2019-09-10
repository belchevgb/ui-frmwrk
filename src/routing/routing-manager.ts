import { Injectable, registerSingleton } from "../di";
import { IRoute, IPathData } from "./interfaces";
import { RouteParser } from "./route-parser";
import { Component, Type } from "../view-engine/compiler/presentation/component";
import { EventHub } from "../common/app-events/event-hub";
import { RouteMatched } from "../common/app-events/events/routing-events";
import { JitViewResolver } from "../view-engine/compiler/presentation/jit-view-resolver";

export const defaultRouteWindowName = "default";

export interface IParsedRoute extends IPathData {
    component: Type<Component>;
    routeWindowName: string;
}

@Injectable
export class RoutingManager {
    private routes: IParsedRoute[] = [];
    routeWindows = new Map<string, Component>();

    constructor(private routeParser: RouteParser, private viewBuilder: JitViewResolver, eventHub: EventHub) {
        eventHub.subscribe(RouteMatched, (route) => {
            this.displayMatchedRoute(route.data);
        });
    }

    registerRoutes(routes: IRoute[]) {
        routes = routes || [];

        for (const route of routes) {
            const pathData = this.routeParser.parse(route.path);
            this.routes.push({ ...pathData, component: route.component, routeWindowName: route.routeWindowName || defaultRouteWindowName });
        }
    }

    getRoutes() {
        return this.routes;
    }

    private displayMatchedRoute(route: IParsedRoute) {
        const routeWindow: any = this.routeWindows.get(route.routeWindowName);
        const view = this.viewBuilder.getView(route.component);

        routeWindow.setView(view);
    }
}
