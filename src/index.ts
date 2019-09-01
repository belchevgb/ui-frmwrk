import { registerServices, start } from "./app";
import { Component, ComponentDef } from "./view-engine/compiler/presentation/component";
export * from "./exports";

registerServices();

@ComponentDef({
    selector: "app",
    template: `
        <div>{{counter}}</div>
        <button (click)="onClick">Click me</button>
    `
})
class AppComponent extends Component {
    private counter = 0;

    onClick() {
        this.data.counter = `Marti e HOMO ${this.counter++}`;
    }
}

start(AppComponent);