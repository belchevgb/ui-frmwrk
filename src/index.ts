import { ComponentDef, Component, ComponentStore } from "./view-engine/compiler/presentation/component";
import { registerType, registerSingleton, resolve, registerValue } from "./di";
import { Renderer } from "./view-engine/compiler/presentation/renderer";
import { ViewBuilder } from "./view-engine/compiler/presentation/view-builder";
import { Lexer } from "./view-engine/compiler/lexer/lexer";
import { Parser } from "./view-engine/compiler/parser/parser";
import { BindingProcessor } from "./view-engine/compiler/bindings/binding-processor";

export * from "./exports";

registerType(Renderer);
registerType(ViewBuilder);
registerType(Lexer);
registerType(Parser);
registerSingleton(ComponentStore);
registerType(BindingProcessor);
