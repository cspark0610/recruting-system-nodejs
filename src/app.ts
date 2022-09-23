import express, { Express } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions, envConfig, swaggerDocs } from "./config";
import errorMiddleware from "./middlewares/error.middleware";
import createRoles from "./lib/createRoles";
import routes from "./routes/index.routes";
import passport from "passport";

const app: Express = express();

if (envConfig.NODE_ENV === "development") {
	const morgan = require("morgan");
	app.use(morgan("dev"));
}

app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(express.json({ limit: "25mb" }));
app.use(cors(corsOptions));

// app.use(
// 	cors({
// 		origin: "*",
// 		methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
// 		preflightContinue: false,
// 	})
// );

// app.use(function (req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST, OPTIONS");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// });

app.use(cookieParser());
app.use(helmet());

createRoles();
swaggerDocs(app, 3001);

app.use(passport.initialize());

app.use("/", routes);

app.use(errorMiddleware);

export default app;
