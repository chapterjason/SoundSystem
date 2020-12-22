import "./styles.scss";
import * as React from "react";
import { resetContext } from "kea";
import { ComponentService } from "./services";
import { NodeOverview } from "./Component/NodeOverview/NodeOverview";
import { ReportComponent } from "./Component/Report/ReportComponent";

resetContext({
    createStore: {},
    plugins: [],
});

ComponentService.set("node_overview", NodeOverview as any);
ComponentService.set("report", ReportComponent as any);
ComponentService.render();
