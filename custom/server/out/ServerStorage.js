"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerStorage = exports.serverStorageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.serverStorageSchema = new mongoose_1.Schema({
    ClientId: { type: String, required: true },
    Key: { type: String, required: true },
    Value: { type: String }
});
exports.ServerStorage = (0, mongoose_1.model)("ServerStorage", exports.serverStorageSchema);
//# sourceMappingURL=ServerStorage.js.map