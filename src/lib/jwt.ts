/* eslint-disable no-underscore-dangle */
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { IUser } from "../db/schemas/interfaces/User";
import { envConfig } from "../config";
import { DataStoredInToken } from "../interfaces";
import { jwtOptsSign, jwtOptsDecode } from "../utils/jwtOpts";
import ICandidate from "../db/schemas/interfaces/ICandidate.interface";
import IPostulation from "../db/schemas/interfaces/IPostulation.interface";

const { GOOGLE_CLIENT_ID } = envConfig;

export function createToken(
	data: IUser | ICandidate | IPostulation,
	expiresIn: string,
	tokenType: string,
	short_url?: string
): string {
	const dataStoredInToken: DataStoredInToken = {
		_id: data._id as string,
		url_id: short_url as string,
	};

	return jwtOptsSign[tokenType as keyof typeof jwtOptsSign](dataStoredInToken, expiresIn);
}

export function decodeToken(token: string, tokenType: string): DataStoredInToken {
	return jwtOptsDecode[tokenType as keyof typeof jwtOptsDecode](token);
}

export const verifyGoogleToken = async (token: string): Promise<TokenPayload> => {
	const client = new OAuth2Client(GOOGLE_CLIENT_ID);
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: GOOGLE_CLIENT_ID,
	});

	return ticket.getPayload();
};
