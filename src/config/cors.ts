import { CorsOptions } from "cors";
import { envConfig } from "./env";

const { NODE_ENV } = envConfig;

export const corsOptions: CorsOptions = {
	origin: [
		"http://localhost:3000",
		"https://workat-five.vercel.app",
		"https://fulltimeforce-video-interview.herokuapp.com",
	],
	// origin: NODE_ENV === "development" ? "http://localhost:3000" : "https://fulltimeforce-video-interview.herokuapp.com/",
	// credentials: true,
	// methods: ["GET", "POST", "PUT", "DELETE"],
};
