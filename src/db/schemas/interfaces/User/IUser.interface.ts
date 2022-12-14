import { Types } from "mongoose";

export interface IUser {
	_id?: string;
	name: string;
	email: string;
	password: string;
	position_name?: string;
	picture?: string;
	phone?: string;
	country?: string;
	role?: Types.ObjectId;
	refresh_token?: string;
	working_since?: string;
	google_sign_in?: boolean;
	google_id?: string;
}
