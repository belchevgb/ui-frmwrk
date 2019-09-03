import { ComponentDef, Component } from "../view-engine/compiler/presentation/component";
import { IComponentInit } from "../view-engine/compiler/presentation/lifecycle-hooks";
import { Router } from "./router";

@ComponentDef({
    selector: "navigation-link",
    template: ""
})
export class NavigationLinkComponent extends Component implements IComponentInit {
    constructor(private router: Router) {
        super();
    }

    onComponentInit(): void {
        this.presentation.addEventListener("click", () => {
            const path = this.data.path;
            this.router.navigate(path);
        });
    }
}