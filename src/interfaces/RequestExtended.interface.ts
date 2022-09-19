import { Request } from "express";
import { Types } from "mongoose";
import { IUser } from "../db/schemas/interfaces/User";
import ICandidate from "../db/schemas/interfaces/ICandidate.interface";
import IPostulation from "../db/schemas/interfaces/IPostulation.interface";

export interface RequestExtended extends Request {
	user?: IUser;
	designated?: Array<IUser>;
	candidate?: ICandidate;
	role?: Types.ObjectId;
	postulation?: IPostulation;
}
