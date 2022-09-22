import { CorsOptions } from "cors";
import { envConfig } from "./env";

const { NODE_ENV } = envConfig;

export const corsOptions: CorsOptions = {
	origin: NODE_ENV === "development" ? "http://localhost:3000" : "https://workat-five.vercel.app",
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};
