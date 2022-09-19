import { Types } from "mongoose";
import { IQuestion } from "../../../interfaces/IQuestion.interface";

export default interface IPostulation {
	_id?: string;
	position: Types.ObjectId;
	salary_expectations?: string;
	skills?: string[];
	linkedin?: string;
	portfolio?: string;
	working_reason?: string;
	main_status?: string;
	secondary_status?: string;
	video_recording_url?: Types.ObjectId;
	videos_question_list?: Array<IQuestion>;
	url_link_2?: string;
}
