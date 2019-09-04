import { registerType, registerSingleton } from "../di";
import { NavigationLinkComponent } from "./navigation-link.component";
import { RouteWindowComponent } from "./route-window.component";
import { RouteMatcher } from "./route-matcher";
import { RouteParser } from "./route-parser";
import { Router } from "./router";
import { RoutingManager } from "./routing-manager";

registerType(NavigationLinkComponent);
registerType(RouteWindowComponent);

registerType(RouteMatcher);
registerType(RouteParser);
registerSingleton(Router);
registerSingleton(RoutingManager);
