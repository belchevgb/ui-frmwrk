import { ComponentDef, Component, ComponentStore } from "./view-engine/compiler/presentation/component";
import { registerType, registerSingleton, resolve, registerValue } from "./di";
import { Renderer } from "./view-engine/compiler/presentation/renderer";
import { ViewBuilder } from "./view-engine/compiler/presentation/view-builder";
import { Lexer } from "./view-engine/compiler/lexer/lexer";
import { Parser } from "./view-engine/compiler/parser/parser";

export * from "./exports";

registerType(Renderer);
registerType(ViewBuilder);
registerType(Lexer);
registerType(Parser);
registerSingleton(ComponentStore);

@ComponentDef({ selector: "component-selector", template: "<div></div>" })
class CustomComponent extends Component { }

@ComponentDef({ selector: "other-selector", template: "<div><component-selector></component-selector></div>" })
class OtherComponent extends Component { }

const builder: ViewBuilder = resolve(ViewBuilder);
const view = builder.createView(OtherComponent);
view;