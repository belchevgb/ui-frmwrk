import { Injectable, registerSingleton } from "../di";
import { IRoute, IPathData } from "./interfaces";
import { RouteParser } from "./route-parser";
import { Component, Type } from "../view-engine/compiler/presentation/component";
import { EventHub } from "../common/app-events/event-hub";
import { RouteMatched } from "../common/app-events/events/routing-events";
import { ViewBuilder } from "../view-engine/compiler/presentation/view-builder";

export interface IParsedRoute extends IPathData {
    component: Type<Component>;
    routeWindowName: string;
}

@Injectable
export class RoutingManager {
    private routes: IParsedRoute[] = [];
    private routeWindows = new Map<string, Component>();

    constructor(private routeParser: RouteParser, private viewBuilder: ViewBuilder, eventHub: EventHub) {
        eventHub.subscribe(RouteMatched, (route) => {
            this.displayMatchedRoute(route.data);
        });
    }

    registerRoutes(routes: IRoute[]) {
        routes = routes || [];

        for (const route of routes) {
            const pathData = this.routeParser.parse(route.path);
            this.routes.push({ ...pathData, component: route.component, routeWindowName: route.routeWindowName });
        }
    }

    registerRouteWindowComponent(name: string, component: Component) {
        this.routeWindows.set(name, component);
    }

    getRoutes() {
        return this.routes;
    }

    private displayMatchedRoute(route: IParsedRoute) {
        const routeWindow = this.routeWindows.get(route.routeWindowName);
        const view = this.viewBuilder.createView(route.component);

        // TODO: handle component destroy and component init
        // TODO: maybe pass the view reference to the route window
        routeWindow.view.presentation.innerHTML = "";
        routeWindow.view.presentation.appendChild(view.presentation);
    }
}

registerSingleton(RoutingManager);
