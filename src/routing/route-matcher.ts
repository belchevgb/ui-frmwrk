import { Injectable } from "../di";
import { RouteParser } from "./route-parser";
import { IPathData, RouteSegmentType } from "./interfaces";
import { RoutingManager, IParsedRoute } from "./routing-manager";

@Injectable
export class RouteMatcher {
    constructor(private routeParser: RouteParser, private routingManager: RoutingManager) { }

    matchRoute(path: string) {
        const parsedPath = this.routeParser.parse(path);
        const matchedRoute = this.findMatchingRoute(parsedPath);

        return matchedRoute;
    }

    private findMatchingRoute(parsedPath: IPathData) {
        const routes = this.routingManager.getRoutes();

        for (const route of routes) {
            if (route.segments.length !== parsedPath.segments.length) {
                continue;
            }

            if (this.doesRouteMatch(parsedPath, route)) {
                return route;
            }
        }

        return null;
    }

    private doesRouteMatch(parsedPath: IPathData, route: IParsedRoute) {
        for (let i = 0; i < parsedPath.segments.length; i++) {
            const pathSegment = parsedPath.segments[i];
            const routeSegment = route.segments[i];

            if (routeSegment.type === RouteSegmentType.Param) {
                continue;
            }

            if (pathSegment.value !== routeSegment.value) {
                return false;
            }
        }

        return true;
    }
}