import * as ReactDOM from "react-dom";
import { Controller } from "stimulus";
import { Provider } from "react-redux";
import { getContext } from "kea";
import * as React from "react";

export class BaseController extends Controller {

    protected render(component: React.ReactNode) {
        ReactDOM.render((
            <Provider store={getContext().store}>
                {component}
            </Provider>
        ), this.element);
    }

}
