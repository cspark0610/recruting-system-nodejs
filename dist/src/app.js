"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
const index_routes_1 = __importDefault(require("./routes/index.routes"));
app.use(express_1.default.urlencoded({ extended: true, limit: '25mb' }));
app.use(express_1.default.json({ limit: '25mb' }));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.use('/', index_routes_1.default);
exports.default = app;
