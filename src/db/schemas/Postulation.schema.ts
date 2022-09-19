import { Schema, model, Types } from "mongoose";
import { valid_main_status, valid_secondary_status } from "../../config";

const PostulationSchema = new Schema(
	{
		position: {
			type: Schema.Types.ObjectId,
			ref: "position",
			autopopulate: true,
			required: true,
		},

		salary_expectations: { type: String, required: false, default: "" },

		skills: { type: [String], required: false },

		linkedin: { type: String, required: false },

		portfolio: { type: String, required: false },

		working_reason: { type: String, required: false },

		main_status: {
			type: String,
			enum: valid_main_status,
			required: true,
		},

		secondary_status: {
			type: String,
			enum: valid_secondary_status,
			required: true,
		},

		video_recording_url: {
			type: Schema.Types.ObjectId,
			ref: "video_recording_url",
			autopopulate: true,
		},

		videos_question_list: [
			{
				question_id: Number,
				question_title: String,
				video_key: String,
			},
		],

		url_link_2: { type: String, required: false },
	},

	{ versionKey: false, timestamps: true }
);

PostulationSchema.plugin(require("mongoose-autopopulate"));

export default model("postulation", PostulationSchema);
