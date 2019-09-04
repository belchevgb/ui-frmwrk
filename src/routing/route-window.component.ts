import { ComponentDef, Component } from "../view-engine/compiler/presentation/component";
import { RoutingManager } from "./routing-manager";

@ComponentDef({
    selector: "route-window",
    template: ""
})
export class RouteWindowComponent extends Component {
    constructor(routingManager: RoutingManager) {
        super();

        const name = this.data.name || "";
        routingManager.registerRouteWindowComponent(name, this);
    }
}