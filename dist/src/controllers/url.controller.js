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
exports.generateUrl = exports.getUniqueUrl = exports.getUrls = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Url_service_1 = require("../services/Url.service");
const getUrls = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urls = yield (0, Url_service_1.GetUrls)();
        if ((urls === null || urls === void 0 ? void 0 : urls.length) === 0) {
            return res.status(404).send({
                status: 'failure',
                code: 404,
                message: 'No urls found',
            });
        }
        return res.status(200).send({
            status: 'success',
            code: 200,
            message: 'Urls found',
            urls,
        });
    }
    catch (e) {
        return res.send(e);
    }
});
exports.getUrls = getUrls;
const getUniqueUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const uniqueUrlId = yield (0, Url_service_1.GetUniqueUrl)(id);
        if (!uniqueUrlId || Object.entries(uniqueUrlId).length === 0) {
            return res.status(404).send({
                status: 'failure',
                code: 404,
                message: 'Url not found. Probably not created yet or expired',
            });
        }
        res.redirect(uniqueUrlId.redirectUrl);
    }
    catch (e) {
        return res.send(e);
    }
});
exports.getUniqueUrl = getUniqueUrl;
const generateUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { redirect_url } = req.body;
        if (!redirect_url) {
            return res.status(400).send({
                status: 'failure',
                code: 400,
                mesage: 'No base url was received',
            });
        }
        const newUrl = yield (0, Url_service_1.GenerateUrl)(redirect_url);
        console.log(newUrl);
        return res.status(201).send({
            status: 'success',
            code: 201,
            message: 'url created',
            url: `${redirect_url}/url/validate?id=${newUrl.shortUrl}`,
        });
    }
    catch (e) {
        return res.send(e);
    }
});
exports.generateUrl = generateUrl;
