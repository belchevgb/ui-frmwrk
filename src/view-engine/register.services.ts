import { registerType } from "../di";

import { ViewBuilder, Renderer, Parser, Lexer } from "..";

import { BindingProcessor } from "./compiler/bindings/binding-processor";

export function initViewEngineDI() {
    registerType(ViewBuilder);
    registerType(Renderer);
    registerType(Parser);
    registerType(Lexer);
    registerType(BindingProcessor);
}
