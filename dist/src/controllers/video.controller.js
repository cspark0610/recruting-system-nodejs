"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideoToS3 = exports.getVideoFromS3 = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const Video_service_1 = require("../services/Video.service");
const unlinkFile = (0, util_1.promisify)(fs_1.unlink);
const getVideoFromS3 = (req, res) => {
    try {
        const { key } = req.params;
        const candidateVideo = (0, Video_service_1.GetVideoFromS3)(key);
        if (!candidateVideo) {
            return res.status(404).send({
                status: 'failure',
                code: 404,
                message: 'Video not found',
            });
        }
        const stream = (0, fs_1.createWriteStream)(`./downloads/${key}`);
        candidateVideo.pipe(stream);
        res.send('success');
    }
    catch (e) {
        return new Error(e);
    }
};
exports.getVideoFromS3 = getVideoFromS3;
const uploadVideoToS3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCandidateVideo = req.file;
        if (!newCandidateVideo) {
            return res.status(400).send({
                status: 'failure',
                code: 400,
                message: 'No file was received',
            });
        }
        const result = yield (0, Video_service_1.UploadVideoToS3)(newCandidateVideo);
        console.log(newCandidateVideo);
        yield unlinkFile(newCandidateVideo.path);
        console.log(result);
        res.send({
            status: 'uploaded successfully',
            videoKey: result === null || result === void 0 ? void 0 : result.Key,
        });
    }
    catch (e) {
        return new Error(e);
    }
});
exports.uploadVideoToS3 = uploadVideoToS3;
