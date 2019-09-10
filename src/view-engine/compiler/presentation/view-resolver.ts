import { Type, Component } from "../../..";
import { ComponentView } from "./view";

export abstract class ViewResolver {
    abstract getView(componentType: Type<Component>): ComponentView;
}