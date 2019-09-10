import { registerType } from "../di";

import { JitViewResolver, Renderer, Parser, Lexer } from "..";

import { BindingProcessor } from "./compiler/bindings/binding-processor";

export function initViewEngineDI() {
    registerType(JitViewResolver);
    registerType(Renderer);
    registerType(Parser);
    registerType(Lexer);
    registerType(BindingProcessor);
}
