import { CorsOptions } from "cors";
import { envConfig } from "./env";

const { NODE_ENV } = envConfig;

export const corsOptions: CorsOptions = {
	origin: ["http://localhost:3000", "https://workat-five.vercel.app"],
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
};
