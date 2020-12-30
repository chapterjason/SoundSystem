"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base64 = void 0;
const buffer_1 = require("buffer");
class Base64 {
    static encode(text) {
        return buffer_1.Buffer.from(text).toString("base64");
    }
    static decode(text) {
        return buffer_1.Buffer.from(text, "base64").toString("utf8");
    }
}
exports.Base64 = Base64;
//# sourceMappingURL=Base64.js.map