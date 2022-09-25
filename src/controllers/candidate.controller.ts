/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
import { Request, Response, NextFunction } from "express";
import { unlink } from "fs";
import { promisify } from "util";
import { decodeToken } from "../lib/jwt";
import { CreateCandidateDto } from "../db/schemas/dtos/Candidate";
import { NotFoundException, BadRequestException, InternalServerException } from "../exceptions";
import * as candidateService from "../services/Candidate.Service";
import * as postulationService from "../services/Postulation.Service";
import { DataStoredInToken } from "../interfaces/DataStoredInToken.interface";

const unlinkFile = promisify(unlink);

export const getAllCandidates = async (_req: Request, res: Response, next: NextFunction) => {
	try {
		const allCandidates = await candidateService.GetAllCandidates(next);

		if (!allCandidates || allCandidates.length === 0) {
			return next(new NotFoundException("No candidates were found"));
		}

		return res.status(200).send({
			status: 200,
			allCandidates,
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the getAllCandidates controller. ${e.message}`
			)
		);
	}
};

export const getCandidatesFiltered = async (req: Request, res: Response, next: NextFunction) => {
	const { position, status, query } = req.body;
	// console.log(position, "positon");
	// console.log(status, "status");
	// console.log(query, "query");

	try {
		const candidatesFiltered = await candidateService.GetCandidatesFiltered(
			next,
			position,
			status,
			query
		);

		if (!candidatesFiltered || candidatesFiltered.length === 0) {
			return next(new NotFoundException("No candidates were found with the provided filters"));
		}

		return res.status(200).send({
			status: 200,
			candidatesFiltered,
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the getCandidatesFiltered controller. ${e.message}`
			)
		);
	}
};

export const getOneCandidate = async (req: Request, res: Response, next: NextFunction) => {
	const { _id } = req.params;

	if (!_id) {
		return next(new BadRequestException("No candidate id was provided"));
	}

	try {
		const candidate = await candidateService.GetOneCandidate(_id, next);

		if (!candidate) {
			return next(new NotFoundException(`No candidate with id ${_id} was found`));
		}

		return res.status(200).send({ status: 200, candidate });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the getOneCandidate controller. ${e.message}`
			)
		);
	}
};

export const getCV = async (req: Request, res: Response, next: NextFunction) => {
	const { key } = req.params;

	try {
		const candidateCV = await candidateService.GetCV(key, next);

		if (!candidateCV) {
			return next(new NotFoundException(`CV file not found`));
		}

		candidateCV.pipe(res);
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the cv download controller. ${e.message}`
			)
		);
	}
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
	const cv = req.file as Express.Multer.File;
	const {
		name,
		email,
		phone,
		position,
		english_level,
		country,
		birth_date,
		linkedin,
		portfolio,
		terms,
	}: CreateCandidateDto = req.body;

	if (terms === "false" || !terms) {
		return next(new BadRequestException("You must accept the terms and conditions"));
	}

	try {
		// uploads CV file to S3. Then the file is removed automatically from the server
		const result = await candidateService.UploadCV(cv, next);
		await unlinkFile(cv.path);

		const cvKey = result?.Key;

		const data = await candidateService.Create(
			{
				name,
				email,
				phone,
				country,
				english_level,
				position,
				birth_date,
				linkedin,
				portfolio,
				cv: cvKey,
			},
			next
		);

		if (!data) {
			return next(
				new InternalServerException("There was an error creating the candidate. Please try again")
			);
		}

		return res.status(201).send({ status: 201, candidate: data });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the candidate creation controller. ${e.message}`
			)
		);
	}
};

// export const updateInfo = async (req: Request, res: Response, next: NextFunction) => {
// 	const { _id } = req.params;
// 	const {
// 		academic_training,
// 		salary_expectations,
// 		available_from,
// 		skills,
// 		working_reason,
// 	}: UpdateCandidateInfoDto = req.body;

// 	const newCandidateInfo = {
// 		academic_training: academic_training,
// 		salary_expectations: salary_expectations,
// 		available_from,
// 		skills: skills,
// 		working_reason,
// 	};

// 	try {
// 		await candidateService.UpdateInfo(_id, newCandidateInfo, next);

// 		return res.status(200).send({ status: 200, message: "Candidate updated successfully" });
// 	} catch (e: any) {
// 		return next(
// 			new InternalServerException(
// 				`There was an error with the candidate info update controller. ${e.message}`
// 			)
// 		);
// 	}
// };

// export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
// 	const { _id } = req.params;
// 	const { main_status, secondary_status }: UpdateStatusDto = req.body;

// 	try {
// 		const data = await candidateService.UpdateStatus(_id, { main_status, secondary_status }, next);

// 		if (!data) {
// 			return next(
// 				new InternalServerException(
// 					"There was an error updating the candidate status. Please try again"
// 				)
// 			);
// 		}

// 		return res.status(200).send({
// 			status: 200,
// 			message: "Candidate status updated successfully",
// 			main_status: data.main_status,
// 			secondary_status: data.secondary_status,
// 		});
// 	} catch (e: any) {
// 		return next(
// 			new InternalServerException(
// 				`There was an error with the candidate status update controller. ${e.message}`
// 			)
// 		);
// 	}
// };

export const updateConclusions = async (req: Request, res: Response, next: NextFunction) => {
	const { _id } = req.params;
	const { good, bad } = req.body;

	try {
		await candidateService.UpdateConclusions(_id, { good, bad }, next);

		return res.status(200).send({
			status: 200,
			message: "Candidate conclusions updated successfully",
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an error with the candidate conclusions update controller. ${e.message}`
			)
		);
	}
};

/* ACA PARA GENERAR EL url_link2 y video_recording_url*/
// export const generateUniqueUrl = async (
// 	req: RequestExtended,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const { candidate } = req;
// 		const token = await candidateService.GenerateUrl(candidate!, next);

// 		if (!token) {
// 			return next(
// 				new InternalServerException("There was an error creating the url. Please try again")
// 			);
// 		}

// 		return res.status(201).send({
// 			status: 201,
// 			message: "Url generated successfully",
// 		});
// 	} catch (e: any) {
// 		return next(
// 			new InternalServerException(
// 				`There was an unexpected error with the url creation controller. ${e.message}`
// 			)
// 		);
// 	}
// };

// export const getVideoFromS3 = (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { key } = req.params;

// 		const candidateVideo = candidateService.GetVideoFromS3(key, next);

// 		if (!candidateVideo) {
// 			return next(new NotFoundException(`No video found`));
// 		}

// 		candidateVideo.pipe(res);
// 	} catch (e: any) {
// 		return next(
// 			new InternalServerException(
// 				`There was an unexpected error with the video download controller. ${e.message}`
// 			)
// 		);
// 	}
// };

// export const uploadVideoToS3 = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const newCandidateVideo = req.file;

// 		const { candidate_id } = req.params;
// 		const { question_id } = req.body;

// 		if (!newCandidateVideo) {
// 			return next(new BadRequestException("No video file was received"));
// 		}

// 		const result = await candidateService.UploadVideoToS3(newCandidateVideo, next);

// 		await unlinkFile(newCandidateVideo.path);

// 		// sets the video_key property in candidate schema after video is uploaded to S3
// 		await candidateService.SaveVideoKey(question_id, candidate_id, next, result!.Key);

// 		return res.status(201).send({
// 			status: 201,
// 			message: "Video uploaded successfully",
// 		});
// 	} catch (e: any) {
// 		return next(
// 			new InternalServerException(
// 				`There was an unexpected error with the video upload controller. ${e.message}`
// 			)
// 		);
// 	}
// };

export const validateUrl = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.query.token as string;

		const decoded: DataStoredInToken = decodeToken(token, "video");
		const candidateInfo = await postulationService.GetCandidateByPostulationId(decoded._id, next);
		const postulationInfo = await postulationService.GetPostulationById(decoded._id, next);

		return res.status(200).send({
			status: 200,
			decoded: {
				candidate: candidateInfo,
				postulation: postulationInfo,
				url_id: decoded.url_id,
			},
		});
	} catch (e: any) {
		return next(
			new InternalServerException(`There was an unexpected error returning the token. ${e.message}`)
		);
	}
};

export const setIsRejected = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { _id } = req.params;
		await candidateService.SetIsRejected(_id, next);

		return res.status(200).send({
			status: 200,
			message: "Candidate rejected status updated successfully",
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an error with the setIsRejected method controller. ${e.message}`
			)
		);
	}
};

// export const disableUrl = async (req: Request, res: Response, next: NextFunction) => {
// 	const { url_id } = req.params;

// 	await candidateService.DisableUrl(url_id, next);

// 	return res.status(200).send({
// 		status: 200,
// 		message: "Url disabled successfully",
// 	});
// };
