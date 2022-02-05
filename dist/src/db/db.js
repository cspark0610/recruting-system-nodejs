"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (process.env.NODE_ENV === 'development') {
    mongoose_1.default.connect(process.env.MONGODB_DEVELOPMENT_URI, (error) => error ? console.error(error) : null);
}
else if (process.env.NODE_ENV === 'production') {
    mongoose_1.default.connect(process.env.MONGODB_PRODUCTION_URI, (error) => error ? console.error(error) : null);
}
