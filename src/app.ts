import express, { Express } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ALLOWED_ORIGINS, corsOptions, envConfig, swaggerDocs } from "./config";
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
app.use(cookieParser());
app.use(helmet());

app.use((req, res, next) => {
	let origin = req.headers.origin;
	let theOrigin = ALLOWED_ORIGINS.indexOf(origin) >= 0 ? origin : ALLOWED_ORIGINS[0];
	res.header("Access-Control-Allow-Origin", theOrigin);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	next();
});

createRoles();
swaggerDocs(app, 3001);

app.use(passport.initialize());

app.use("/", routes);

app.use(errorMiddleware);

export default app;
