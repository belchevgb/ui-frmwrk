import { Injectable, registerSingleton } from "../di";
import { RouteMatcher } from "./route-matcher";
import { EventHub } from "../common/app-events/event-hub";
import { RouteMatched } from "../common/app-events/events/routing-events";

@Injectable
export class Router {
    constructor(private routeMatcher: RouteMatcher, private eventHub: EventHub) { }

    navigate(path: string, queryParams: { [key: string]: string } = {}) {
        const matchedRoute = this.routeMatcher.matchRoute(path);

        if (!matchedRoute) {
            throw new Error(`There is no Component for ${path}.`);
        }

        history.pushState({}, path, path);
        this.eventHub.raise(new RouteMatched(matchedRoute));
    }
}
