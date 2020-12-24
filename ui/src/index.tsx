import "./styles.scss";
import * as React from "react";
import { resetContext } from "kea";
import { ComponentService } from "./services";
import { NodeOverview } from "./Component/NodeOverview/NodeOverview";
import { ReportingComponent } from "./Component/Reporting/ReportingComponent";

resetContext({
    createStore: {},
    plugins: [],
});

ComponentService.set("node_overview", NodeOverview as any);
ComponentService.set("report", ReportingComponent as any);
ComponentService.render();
