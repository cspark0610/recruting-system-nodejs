/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from "express";
import { unlink } from "fs";
import { promisify } from "util";
//import { decodeToken } from "../lib/jwt";
import {
	InternalServerException,
	BadRequestException,
	//NotFoundException,
	//InvalidAccessToken,
} from "../exceptions";
//import { RequestExtended } from "../interfaces";
import Candidate from "../db/schemas/Candidate.schema";
//import ICandidate from "../db/schemas/interfaces/ICandidate.interface";
import Position from "../db/schemas/Position.schema";
//import VideoRecordingUrlSchema from "../db/schemas/VideoRecordingUrl.schema";

const unlinkFile = promisify(unlink);

// checks that there is not another candidate with the same email before sign up
export async function verifyCandidateExistsBeforeSignUp(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	const { email, position } = req.body;
	const cv = req.file as Express.Multer.File;

	try {
		const candidateExists = await Candidate.findOne({ email });

		//checks that the job a candidate is applying for exists
		const positionExists = await Position.findById(position);

		if (!positionExists) {
			await unlinkFile(cv.path);
			return next(new BadRequestException(`No position has been found with the id ${position}`));
		}

		if (candidateExists && candidateExists?.position?.equals(position!)) {
			await unlinkFile(cv.path);
			return next(
				new BadRequestException(
					`There is already a candidate registered with the email ${email} for the position`
				)
			);
		}

		// checks that the candidate has not been rejected in a passed postulation
		if (candidateExists?.isRejected) {
			await unlinkFile(cv.path);
			return next(
				new BadRequestException(
					`The candidate with the email ${email} has been rejected. Please contact the admin`
				)
			);
		}

		next();
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the candidate verification. ${e.message}. Please try again`
			)
		);
	}
}

/* TRASLADADO A Postulation.middleware.ts */
// export async function verifyCandidateExistsBeforeUrlGeneration(
// 	req: RequestExtended,
// 	_res: Response,
// 	next: NextFunction
// ) {
// 	const { _id } = req.params;

// 	try {
// 		const candidate = await Candidate.findById(_id);

// 		if (!candidate) {
// 			return next(new NotFoundException(`No candidate found with the id ${_id}`));
// 		}

// 		req.candidate = candidate as ICandidate;

// 		next();
// 	} catch (e: any) {
// 		return next(
// 			new InternalServerException(
// 				`There was an unexpected error verifying the candidate. ${e.message}`
// 			)
// 		);
// 	}
// }

/* TRASLADADO A Postulation.middleware.ts */
// export async function verifyCandidateUrlDisabled(req: Request, _res: Response, next: NextFunction) {
// 	const { url_id } = req.params;

// 	try {
// 		const videoUrl = await VideoRecordingUrlSchema.findOne({
// 			short_url: url_id,
// 		});

// 		if (!videoUrl) {
// 			return next(new BadRequestException(`No video url found with id ${url_id}`));
// 		}

// 		if (videoUrl.isDisabled) {
// 			return next(new BadRequestException(`The video url is already disabled`));
// 		}

// 		next();
// 	} catch (e: any) {
// 		return next(
// 			new InternalServerException(
// 				`There was an unexpected error verifying the candidate. ${e.message}`
// 			)
// 		);
// 	}
// }

export async function validateCV(req: Request, _res: Response, next: NextFunction) {
	const cv = req.file;

	if (!cv) {
		return next(new BadRequestException("You must add your resume"));
	}

	if (cv.mimetype !== "application/pdf") {
		await unlinkFile(cv.path);
		return next(new BadRequestException("Only pdf files are supported"));
	}

	next();
}

/* se traslada a Postulation.middleware metodo validatePostulationJwt */
// export async function validateCandidateJwt(req: Request, _res: Response, next: NextFunction) {
// 	const token = req.query.token as string;

// 	try {
// 		const decoded = decodeToken(token, "video");

// 		const candidate = await Candidate.findById(decoded._id);
// 		const url = await VideoRecordingUrlSchema.findOne({
// 			short_url: decoded.url_id,
// 		});

// 		if (!candidate || url?.isDisabled) {
// 			return next(new InvalidAccessToken());
// 		}

// 		next();
// 	} catch (e: any) {
// 		return next(new InvalidAccessToken(e.message));
// 	}
// }
