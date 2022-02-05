"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_routes_1 = __importDefault(require("./video.routes"));
const url_routes_1 = __importDefault(require("./url.routes"));
const router = (0, express_1.Router)();
router.get('', (_req, res) => {
    res.render('pages/index');
});
router.use('/video', video_routes_1.default);
router.use('/url', url_routes_1.default);
exports.default = router;
