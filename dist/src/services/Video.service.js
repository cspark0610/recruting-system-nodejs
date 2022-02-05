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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadVideoToS3 = exports.GetVideoFromS3 = void 0;
const fs_1 = require("fs");
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { AWS_BUCKET_REGION, AWS_BUCKET_ACCESS_KEY, AWS_BUCKET_SECRET_ACCESS_KEY, } = process.env;
const s3 = new s3_1.default({
    accessKeyId: AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: AWS_BUCKET_SECRET_ACCESS_KEY,
    region: AWS_BUCKET_REGION,
});
const GetVideoFromS3 = (key) => {
    try {
        const getParams = {
            Bucket: 'videorecorderbucket',
            Key: key,
        };
        return s3.getObject(getParams).createReadStream();
    }
    catch (e) {
        console.error(e);
    }
};
exports.GetVideoFromS3 = GetVideoFromS3;
const UploadVideoToS3 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileStream = (0, fs_1.createReadStream)(file.path);
        const uploadParams = {
            Bucket: 'videorecorderbucket',
            Body: fileStream,
            Key: file.filename,
        };
        return yield s3.upload(uploadParams).promise();
    }
    catch (e) {
        console.error(e);
    }
});
exports.UploadVideoToS3 = UploadVideoToS3;
