import { Types } from "mongoose";
import { IConclusions } from "../../../interfaces";

export default interface ICandidate {
	_id?: string;
	name: string;
	email: string;
	phone: number;
	country: string;
	academic_training?: string;
	available_from?: string;
	english_level: string;
	birth_date: string;
	conclusions?: IConclusions;
	postulations?: Array<Types.ObjectId>;
	position?: Types.ObjectId;
	designated_recruiters?: Array<string>;
	cv?: string;
	terms?: string;
	isRejected?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}
