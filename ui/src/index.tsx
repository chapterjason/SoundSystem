import "./styles.scss";
import * as React from "react";
import { resetContext } from "kea";
import { Application } from "stimulus";
import { NodeOverViewController } from "./Controller/NodeOverViewController";

resetContext({
    createStore: {},
    plugins: [],
});

const application = Application.start();

application.register("node-overview", NodeOverViewController);
