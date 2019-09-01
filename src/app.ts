import { registerType, registerSingleton, resolve } from "./di";

import { Renderer, ViewBuilder, Lexer, Parser, ComponentStore } from "./exports";

import { BindingProcessor } from "./view-engine/compiler/bindings/binding-processor";
import { IComponentRegistration, Type } from "./view-engine/compiler/presentation/component";

const ROOT_ELEMENT_SELECTOR = "app";

export function registerServices() {
    registerType(Renderer);
    registerSingleton(ComponentStore);
    registerType(ViewBuilder);
    registerType(Lexer);
    registerType(Parser);
    registerType(BindingProcessor);
}

export function start(rootComponentType: Type<any>) {
    const element = document.getElementById(ROOT_ELEMENT_SELECTOR);
    const builder: ViewBuilder = resolve(ViewBuilder);
    const mainView = builder.createView(rootComponentType);

    element.appendChild(mainView.presentation);
}
