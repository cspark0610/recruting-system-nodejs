import { CorsOptions } from "cors";
import { envConfig } from "./env";

const { NODE_ENV } = envConfig;

export const ALLOWED_ORIGINS = ["https://workat-five.vercel.app", "http://localhost:3000"];

export const corsOptions: CorsOptions = {
	origin: ["https://workat-five.vercel.app", "http://localhost:3000"],
	// origin: NODE_ENV === "development" ? "http://localhost:3000" : "https://fulltimeforce-video-interview.herokuapp.com/",
	// credentials: true,
	// methods: ["GET", "POST", "PUT", "DELETE"],
};
