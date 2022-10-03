/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
import { NextFunction } from "express";
import { createReadStream } from "fs";

//constants
import { valid_video_question_titles } from "../config/constants";

// utils
// import { createToken } from "../lib/jwt";
import { envConfig, s3 } from "../config";

// exceptions
import { InternalServerException } from "../exceptions";

//schemas
import Candidate from "../db/schemas/Candidate.schema";
import Postulation from "../db/schemas/Postulation.schema";
import User from "../db/schemas/User.schema";
import Position from "../db/schemas/Position.schema";

//interfaces
import { File, UploadParams, IConclusions } from "../interfaces";
//import ICandidate from "../db/schemas/interfaces/ICandidate.interface";
import ICandidateInfo from "../db/schemas/interfaces/ICandidateInfo.interface";
import ICandidate from "../db/schemas/interfaces/ICandidate.interface";

const { AWS_CV_BUCKET_NAME } = envConfig;

export const GetAllCandidates = async (next: NextFunction) => {
	try {
		return await Candidate.find();
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the GetAllCandidates service. ${e.message}`
			)
		);
	}
};

export const GetCandidatesFilteredExpert = async (
	next: NextFunction,
	candidate_name: string,
	skills: Array<string>,
	employment_status: Array<string>
) => {
	try {
		//  solo llega skills
		if (candidate_name === "" && skills.length && !employment_status.length) {
			const candidates: ICandidate[] = await Candidate.aggregate([
				{
					$lookup: {
						from: "postulations",
						localField: "postulations",
						foreignField: "_id",
						as: "postulations",
					},
				},
				{
					$match: {
						"postulations.skills": { $all: [...skills] },
					},
				},
			]);
			return candidates;
		}

		// solo llega name
		if (candidate_name !== "" && !skills.length && !employment_status.length) {
			let re = new RegExp(candidate_name, "i");
			const res = await Candidate.find({
				name: { $regex: re },
			});
			return res;
		}
		// solo llega employment_status
		if (candidate_name === "" && !skills.length && employment_status.length) {
			const res = await Candidate.find({
				employment_status: { $all: [...employment_status] },
			});
			return res;
		}
		//llega name & employment_status
		if (candidate_name !== "" && !skills.length && employment_status.length) {
			let re = new RegExp(candidate_name, "i");
			const res = await Candidate.find({
				$or: [{ name: { $regex: re } }, { employment_status: { $all: [...employment_status] } }],
			});
			return res;
		}
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the GetCandidatesFilteredExpert service. ${e.message}`
			)
		);
	}
};

export const GetCandidatesFiltered = async (
	next: NextFunction,
	position: Array<string>,
	status: Array<string>,
	query: string
) => {
	try {
		// llega status  & position & query
		if (query !== "" && status.length && position.length) {
			let re = new RegExp(query, "i");
			const res = await Candidate.find({
				position: { $in: position },
				"postulations.secondary_status": { $in: status },
				$or: [
					{ name: { $regex: re } },
					{ academic_training: { $regex: re } },
					{ available_from: { $regex: re } },
					{ english_level: { $regex: re } },
					{ country: { $regex: re } },
					{ designated_recruiters: { $all: [`${query}`] } },
				],
			});
			return res;
		}

		// solo llega query
		if (query !== "" && !status.length && !position.length) {
			let re = new RegExp(query, "i");
			const result = await Candidate.find({
				$or: [
					{ name: { $regex: re } },
					{ academic_training: { $regex: re } },
					{ available_from: { $regex: re } },
					{ english_level: { $regex: re } },
					{ country: { $regex: re } },
					{ designated_recruiters: { $all: [`${query}`] } },
				],
			});
			return result;
		}
		//llega solo status
		if (!position.length && status.length && query === "") {
			const res: ICandidate[] = await Candidate.aggregate([
				{
					$lookup: {
						from: "postulations",
						localField: "postulations",
						foreignField: "_id",
						as: "postulations",
					},
				},
				{
					$match: {
						"postulations.secondary_status": { $in: status },
					},
				},
			]);
			return res;
		}

		//llega solo position
		if (position.length && !status.length && query === "") {
			const candidates = await Candidate.find({});
			const filtered = candidates.filter((candidate) =>
				position.includes(candidate.position._id.toString())
			);
			return filtered;
		}

		// llega position & query
		if (position.length && !status.length && query !== "") {
			let re = new RegExp(query, "i");
			const res = await Candidate.find({
				position: { $in: position },
				$or: [
					{ name: { $regex: re } },
					{ academic_training: { $regex: re } },
					{ available_from: { $regex: re } },
					{ english_level: { $regex: re } },
					{ country: { $regex: re } },
					{ designated_recruiters: { $all: [`${query}`] } },
				],
			});
			return res;
		}
		//llega status & query
		if (!position.length && status.length && query !== "") {
			let re = new RegExp(query, "i");
			const res = await Candidate.find({
				"postulations.secondary_status": { $in: status },
				$or: [
					{ name: { $regex: re } },
					{ academic_training: { $regex: re } },
					{ available_from: { $regex: re } },
					{ english_level: { $regex: re } },
					{ country: { $regex: re } },
					{ designated_recruiters: { $all: [`${query}`] } },
				],
			});
			return res;
		}
		//llega solo position & status
		if (position.length && status.length && query === "") {
			const res = await Candidate.find({
				$or: [
					{ "postulations.secondary_status": { $in: status } },
					{ position: { $in: position } },
				],
			});
			return res;
		}
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the GetCandidatesFiltered service. ${e.message}`
			)
		);
	}
};

export const GetOneCandidate = async (_id: string, next: NextFunction) => {
	try {
		const candidate = await Candidate.findById(_id);
		const cvUrl = await GetCV(candidate.cv!, next);

		const updatedCandidate = await Candidate.findOneAndUpdate(
			{ _id: candidate._id },
			{
				cv: cvUrl,
			},
			{ new: true }
		);

		return updatedCandidate;
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the GetOneCandidate service. ${e.message}`
			)
		);
	}
};

const createVideoQuestions = async (postulationId: string) => {
	const postulation = await Postulation.findOne({
		_id: postulationId,
	});

	const video_question_1 = {
		question_id: 1,
		question_title: valid_video_question_titles[0],
		video_key: "",
	};
	const video_question_2 = {
		question_id: 2,
		question_title: valid_video_question_titles[1] + `${postulation.position["title"]}`,
		video_key: "",
	};

	return {
		video_question_1,
		video_question_2,
	};
};

export const Create = async (candidateInfo: ICandidateInfo, next: NextFunction) => {
	try {
		const position = await Position.findById(candidateInfo.position);

		const designatedUsers = await User.find({
			_id: { $in: position?.designated },
		});

		const userNames = designatedUsers.length > 0 && designatedUsers.map((user) => user.name);

		const previousPostulations = [];
		const queryEmailObj = {
			email: candidateInfo.email.trim(),
		};
		const previousCandidate = await Candidate.findOne(queryEmailObj);

		previousCandidate &&
			previousCandidate.postulations.forEach((postulation) => {
				previousPostulations.push(postulation);
			});

		//create new Postulation
		const newPostulation = await Postulation.create({
			position: position._id,
			linkedin: candidateInfo.linkedin,
			portfolio: candidateInfo.portfolio,
			main_status: "interested",
			secondary_status: "new entry",
		});

		const { video_question_1, video_question_2 } = await createVideoQuestions(
			newPostulation._id.toString()
		);

		const updatedPostulation = await Postulation.findOneAndUpdate(
			{ _id: newPostulation._id },
			{
				$push: {
					video_questions_list: { $each: [{ ...video_question_1 }, { ...video_question_2 }] },
				},
			},
			{ new: true }
		);

		if (previousCandidate) {
			const previousCandidateUpdated = await Candidate.findByIdAndUpdate(
				previousCandidate._id,
				{ ...candidateInfo, postulations: [...previousPostulations, updatedPostulation] },
				{ new: true }
			);
			return previousCandidateUpdated;
		}

		const newCandidate = await Candidate.create({
			...candidateInfo,
			position,
			designated_recruiters: userNames,
			videos_question_list: position?.video_questions_list,
		});
		const updatedCandidate = await Candidate.findByIdAndUpdate(
			newCandidate._id,
			{
				$push: {
					postulations: { ...updatedPostulation },
				},
			},
			{ new: true }
		);
		return updatedCandidate;
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the candidate creation service. ${e.message}`
			)
		);
	}
};

export const UpdateConclusions = async (
	_id: string,
	newConclusions: IConclusions,
	next: NextFunction
) => {
	try {
		return await Candidate.findByIdAndUpdate(_id, {
			$push: {
				"conclusions.good": newConclusions.good,
				"conclusions.bad": newConclusions.bad,
			},
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the candidate conclusions update service. ${e.message}`
			)
		);
	}
};

export const GetCV = async (key: string, next: NextFunction) => {
	try {
		const getParams = {
			Bucket: AWS_CV_BUCKET_NAME,
			Key: key,
		};

		const signedUrl: string = s3.getSignedUrl("getObject", getParams);
		return signedUrl;
	} catch (e: any) {
		next(
			new InternalServerException(
				`There was an unexpected error with the cv download service. ${e.message}`
			)
		);
	}
};

export const UploadCV = async (cv: File, next: NextFunction) => {
	try {
		const fileStream = createReadStream(cv.path);

		const uploadParams: UploadParams = {
			Bucket: AWS_CV_BUCKET_NAME,
			Body: fileStream,
			Key: cv.filename,
		};

		return s3.upload(uploadParams).promise();
	} catch (e: any) {
		next(
			new InternalServerException(
				`There was an unexpected error with the cv upload service. ${e.message}`
			)
		);
	}
};

export const SetIsRejected = async (_id: string, next: NextFunction) => {
	try {
		await Candidate.findByIdAndUpdate(_id, {
			isRejected: true,
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with SetIsRejected method service. ${e.message}`
			)
		);
	}
};

export const UpdateCandidateEmploymentStatus = async (
	_id: string,
	employment_status: string,
	next: NextFunction
) => {
	try {
		const candidate = await Candidate.findById(_id);
		if (candidate.isRejected) {
			return next(
				new InternalServerException(`Cannot update employment_status of rejected candidates.`)
			);
		}
		return await Candidate.findOneAndUpdate({ _id }, { employment_status }, { new: true });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the candidate employment_status service. ${e.message}`
			)
		);
	}
};
