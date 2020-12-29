import * as React from "react";
import { FunctionComponent } from "react";
import { Provider } from "react-redux";
import { getContext } from "kea";
import * as ReactDOM from "react-dom";

export class ComponentService {

    private components: Record<string, FunctionComponent> = {};

    public set(name: string, component: FunctionComponent) {
        this.components[name] = component;
    }

    public render() {
        const componentRoots: HTMLDivElement[] = Array.from(document.querySelectorAll("div[data-component]"));

        for (const componentRoot of componentRoots) {
            const rendered = (componentRoot.getAttribute("data-rendered") ?? "false") !== "false";

            if (!rendered) {
                this.renderComponent(componentRoot);
            }
        }
    }

    private renderComponent(componentRoot: HTMLDivElement): void {
        const name = componentRoot.getAttribute("data-component");
        const id = componentRoot.id;

        if (!name) {
            throw new Error("Missing attribute \"name\"");
        }

        if (!id) {
            throw new Error("Missing attribute \"id\"");
        }

        if (!(name in this.components)) {
            throw new Error(`Component "${name}" not found.`);
        }

        const propsElement = document.getElementById(`${id}_props`);

        if (!propsElement) {
            throw new Error(`Props "${id}_props" not found.`);
        }

        const props = JSON.parse(propsElement.innerHTML);
        const Component = this.components[name];

        console.log(props);

        ReactDOM.render(
            <Provider store={getContext().store}>
                <Component {...props}/>
            </Provider>,
            componentRoot,
        );

        componentRoot.setAttribute("data-rendered", "true");

    }
}
