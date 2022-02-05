"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const multerConfig_1 = __importDefault(require("../lib/multerConfig"));
const video_controller_1 = require("../controllers/video.controller");
const upload = (0, multer_1.default)({ storage: multerConfig_1.default });
const router = (0, express_1.Router)();
router.get('/get/:key', video_controller_1.getVideoFromS3);
router.post('/save', upload.single('video'), video_controller_1.uploadVideoToS3);
exports.default = router;
