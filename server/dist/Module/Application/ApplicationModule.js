"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModule = void 0;
const common_1 = require("@nestjs/common");
const HomeController_1 = require("./Controller/HomeController");
const typeorm_1 = require("@nestjs/typeorm");
const NodeController_1 = require("./Controller/NodeController");
const SoundServer_1 = require("./Service/Node/SoundServer");
const Meta_1 = require("../../Meta");
const HealthController_1 = require("./Controller/HealthController");
let ApplicationModule = class ApplicationModule {
};
ApplicationModule = __decorate([
    common_1.Module({
        controllers: [
            HomeController_1.HomeController,
            HealthController_1.HealthController,
            NodeController_1.NodeController,
        ],
        providers: [
            SoundServer_1.SoundServer,
        ],
        imports: [
            typeorm_1.TypeOrmModule.forRoot(require(Meta_1.joinToPackageDirectory("ormconfig.js"))),
        ],
    })
], ApplicationModule);
exports.ApplicationModule = ApplicationModule;
//# sourceMappingURL=ApplicationModule.js.map