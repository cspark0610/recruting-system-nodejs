"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const url_controller_1 = require("../controllers/url.controller");
const router = (0, express_1.Router)();
router.get('/get', url_controller_1.getUrls);
router.get('/validate', url_controller_1.getUniqueUrl);
router.post('/create', url_controller_1.generateUrl);
exports.default = router;
