"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundServerController = void 0;
const network_1 = require("@soundsystem/network");
const common_1 = require("@nestjs/common");
class SoundServerController extends network_1.CommandController {
    constructor() {
        super();
        this.logger = new common_1.Logger("SoundServerController");
        this.set("configuration", this.configuration.bind(this));
    }
    async configuration(data, command, socket) {
        if (null === socket.getUserData()) {
            this.logger.log(`First configuration ${data.hostname}`);
        }
        socket.setUserData(data);
    }
}
exports.SoundServerController = SoundServerController;
//# sourceMappingURL=SoundServerController.js.map