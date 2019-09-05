import { ApplicationEvent } from "./base";
import { IParsedRoute } from "../../../routing/routing-manager";

export class RouteMatched extends ApplicationEvent<IParsedRoute> {
}