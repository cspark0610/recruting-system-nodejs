/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
import { Request, Response, NextFunction } from "express";
import { unlink } from "fs";
import { promisify } from "util";

//interfaces
import { BadRequestException, InternalServerException, NotFoundException } from "../exceptions";
import { RequestExtended } from "../interfaces";
// dtos
import { UpdatePostulationInfoDto } from "../db/schemas/dtos/Candidate/UpdatePostulationInfoDto.dto";
//schemas

//services
import * as postulationService from "../services/Postulation.Service";
import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";

export const updateInfo = async (req: Request, res: Response, next: NextFunction) => {
	const { _id } = req.params;

	try {
		const newPostulationInfo: UpdatePostulationInfoDto = req.body;
		await postulationService.UpdateInfo(_id, newPostulationInfo, next);

		return res.status(200).send({ status: 200, message: "Postulation updated successfully" });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an error with the candidate info updateInfo controller. ${e.message}`
			)
		);
	}
};

export const UpdatePostulationStatus = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { _id } = req.params;
		const body = req.body;
		const data = await postulationService.UpdatePostulationStatus(_id, body, next);

		if (!data) {
			return next(
				new InternalServerException(
					"There was an error with UpdatePostulationStatus. Please try again"
				)
			);
		}

		return res.status(200).send({
			status: 200,
			message: "Postulation status updated successfully",
			main_status: data.main_status,
			secondary_status: data.secondary_status,
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an error with the postulation status update controller. ${e.message}`
			)
		);
	}
};

export const generateUniqueUrl = async (
	req: RequestExtended,
	res: Response,
	next: NextFunction
) => {
	try {
		const { postulation } = req;
		const token = await postulationService.GenerateUrl(postulation!, next);

		if (!token) {
			return next(
				new InternalServerException(
					"There was an error creating the url_link_2 `generateUniqueUrl`. Please try again"
				)
			);
		}

		return res.status(201).send({
			status: 201,
			message: "url_link2 generated successfully",
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the generateUniqueUrl controller method. ${e.message}`
			)
		);
	}
};

export const disableUrl = async (req: Request, res: Response, next: NextFunction) => {
	const { url_id } = req.params;

	await postulationService.DisableUrl(url_id, next);

	return res.status(200).send({
		status: 200,
		message: "Url disabled successfully",
	});
};

// Asynchronous unlink(2) - delete a name and possibly the file it refers to.
const unlinkFile = promisify(unlink);
export const uploadVideoToS3 = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const newCandidateVideo: Express.Multer.File = req.file;

		const { postulation_id } = req.params;
		const { question_id } = req.body;

		if (!newCandidateVideo) {
			return next(new BadRequestException("No video file was received"));
		}

		const result: ManagedUpload.SendData = await postulationService.UploadVideoToS3(
			newCandidateVideo,
			next
		);

		if (result) {
			const promisesArr = [
				unlinkFile(newCandidateVideo.path),
				// sets the video_key property in postulation schema after video is uploaded to S3
				postulationService.SaveVideoKey(question_id, postulation_id, next, result.Key),
			];
			await Promise.allSettled(promisesArr);

			return res.status(201).send({
				status: 201,
				message: "Video uploaded successfully",
			});
		}
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the video upload controller. ${e.message}`
			)
		);
	}
};

export const getVideoFromS3 = (req: Request, res: Response, next: NextFunction) => {
	try {
		const { key } = req.params;

		const candidateVideo: string | void = postulationService.GetVideoFromS3(key, next);

		if (!candidateVideo) {
			return next(new NotFoundException(`No video found`));
		}
		return res.send(candidateVideo);
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the getVideoFromS3 method controller. ${e.message}`
			)
		);
	}
};
