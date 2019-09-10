import { ViewResolver } from "../view-resolver";
import { Type, Component } from "../../../..";
import { ComponentView } from "../view";
import { resolve } from "../../../../di";

export class AotViewResolver extends ViewResolver {
    getView(componentType: Type<Component>): ComponentView {
        const key = `${componentType.name}_view`;
        const view = resolve(key);

        return view;
    }
}