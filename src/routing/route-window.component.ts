import { ComponentDef, Component } from "../view-engine/compiler/presentation/component";
import { RoutingManager, defaultRouteWindowName } from "./routing-manager";
import { ComponentView } from "../view-engine/compiler/presentation/view";
import { lifecycleHookNames, IComponentInit } from "../view-engine/compiler/presentation/lifecycle-hooks";

@ComponentDef({
    selector: "route-window",
    template: ""
})
export class RouteWindowComponent extends Component implements IComponentInit {
    private hostedView: ComponentView;

    constructor(private routingManager: RoutingManager) {
        super();
    }

    onComponentInit(): void {
        const name = this.data.name || defaultRouteWindowName;
        this.routingManager.routeWindows.set(name, this);
    }

    setView(matchedRouteView: ComponentView) {
        this.callLifecycleHook(lifecycleHookNames.onComponentDestroy);

        this.hostedView = matchedRouteView;
        this.view.replacePresentation(matchedRouteView.presentation);

        this.callLifecycleHook(lifecycleHookNames.onComponentInit);
    }

    private callLifecycleHook(hookName: string) {
        if (this.hostedView) {
            this.hostedView.callLifecycleHook(hookName);
        }
    }
}