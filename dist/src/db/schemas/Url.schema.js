"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const shortid_1 = __importDefault(require("shortid"));
const UrlSchema = new mongoose_1.default.Schema({
    redirectUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        default: shortid_1.default.generate,
    },
    expiresAt: {
        type: Date,
        default: new Date(),
        index: { expires: '24h' },
    },
});
UrlSchema.index({ expiresAt: 1 }, { expires: '24h' });
exports.default = mongoose_1.default.model('Url', UrlSchema);
