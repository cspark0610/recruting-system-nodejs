"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = require("multer");
const storage = (0, multer_1.diskStorage)({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads');
    },
    filename: (_req, file, cb) => {
        const fileType = file.mimetype.split('/');
        cb(null, `${file.fieldname}-${Date.now()}.${fileType[1]}`);
    },
});
exports.default = storage;
