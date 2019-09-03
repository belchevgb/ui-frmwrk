import { Injectable } from "../di";
import { IRoute, IPathData } from "./interfaces";
import { RouteParser } from "./route-parser";
import { Component, Type } from "../view-engine/compiler/presentation/component";

interface IParsedRoute extends IPathData {
    component: Type<Component>;
}

@Injectable
export class RoutesManager {
    private routes: IParsedRoute[] = [];

    constructor(private routeParser: RouteParser) {
    }

    registerRoutes(routes: IRoute[]) {
        routes = routes || [];

        for (const route of routes) {
            const pathData = this.routeParser.parse(route.path);
            this.routes.push({ ...pathData, component: route.component });
        }
    }
}