import { BaseController } from "./BaseController";
import { NodeOverview } from "../Component/NodeOverview/NodeOverview";
import * as React from "react";

export class NodeOverViewController extends BaseController {

    public connect() {
        this.render(<NodeOverview/>);
    }

}
