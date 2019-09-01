import { resolve } from "./di";

import { ViewBuilder } from "./exports";

import { Type } from "./view-engine/compiler/presentation/component";

const ROOT_ELEMENT_SELECTOR = "app";

export function start(rootComponentType: Type<any>) {
    const element = document.getElementById(ROOT_ELEMENT_SELECTOR);
    const builder: ViewBuilder = resolve(ViewBuilder);
    const mainView = builder.createView(rootComponentType);

    element.appendChild(mainView.presentation);
}
