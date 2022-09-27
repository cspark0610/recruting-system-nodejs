import { NextFunction } from "express";
import { createToken } from "../lib/jwt";
import { envConfig, s3 } from "../config";
import { createReadStream } from "fs";

// constans
import { valid_main_status, valid_secondary_status } from "../config/constants";

// exceptions
import { InternalServerException } from "../exceptions";

// interfaces
import { RequestExtended, UploadParams } from "../interfaces";
import IPostulation from "../db/schemas/interfaces/IPostulation.interface";

// schemas
import Postulation from "../db/schemas/Postulation.schema";
import Candidate from "../db/schemas/Candidate.schema";
import VideoRecordingUrl from "../db/schemas/VideoRecordingUrl.schema";

// dtos
import { UpdatePostulationInfoDto } from "../db/schemas/dtos/Candidate/UpdatePostulationInfoDto.dto";
import { UpdateStatusDto } from "../db/schemas/dtos/Candidate/UpdateStatusDto.dto";
import { AWSError, S3 } from "aws-sdk";

const {
	AWS_VIDEO_BUCKET_NAME,
	NODE_ENV,
	REDIRECT_URL_DEVELOPMENT,
	REDIRECT_URL_PRODUCTION,
	JWT_VIDEO_TOKEN_EXP,
} = envConfig;

export const GetPostulationById = async (_id: string, next: NextFunction) => {
	try {
		return Postulation.findById(_id);
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the GetPostulationById service. ${e.message}`
			)
		);
	}
};

export const GetCandidateByPostulationId = async (postulationId: string, next: NextFunction) => {
	try {
		const candidate = await Candidate.findOne({
			postulations: {
				$all: [`${postulationId}`],
			},
		});
		return candidate;
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the GetCandidateByPostulationId service. ${e.message}`
			)
		);
	}
};

export const Create = async (
	postulationInfo: IPostulation,
	next: NextFunction,
	req: RequestExtended
) => {
	try {
		const newPostulation = await Postulation.create({
			...postulationInfo,
		});

		return newPostulation;
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the postulation Create service. ${e.message}`
			)
		);
	}
};

export const UpdateInfo = async (
	_id: string,
	newPostulationInfo: UpdatePostulationInfoDto,
	next: NextFunction
) => {
	try {
		const foundPostulation = await Postulation.findById(_id);
		const candidate = await Candidate.findOne({
			postulations: {
				$all: [`${_id}`],
			},
		});

		if (candidate && foundPostulation) {
			const { academic_training, available_from } = newPostulationInfo;
			const promisesArr = [
				Candidate.findByIdAndUpdate(
					candidate._id,
					{ academic_training, available_from },
					{ new: true }
				),
				Postulation.findByIdAndUpdate(_id, newPostulationInfo, { new: true }),
			];

			return Promise.allSettled(promisesArr);
		}
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the postulation UpdateInfo service. ${e.message}`
			)
		);
	}
};

export const UpdatePostulationStatus = async (
	_id: string,
	newStatus: UpdateStatusDto,
	next: NextFunction
) => {
	try {
		// 3. si llegan ambos, update ambos campos
		if (newStatus.main_status && newStatus.secondary_status) {
			const { main_status, secondary_status } = newStatus;
			await Postulation.findOneAndUpdate(
				{ _id },
				{
					$set: {
						main_status: main_status,
						secondary_status: secondary_status,
					},
				},
				{ new: true }
			);
			return { main_status, secondary_status };
		}
		// 2. si llega solo el secondary_status
		if (newStatus.secondary_status) {
			const { secondary_status } = newStatus;
			const res = await Postulation.findOneAndUpdate(
				{ _id },
				{ $set: { secondary_status: secondary_status } },
				{ new: true }
			);
			return {
				main_status: valid_main_status[0],
				secondary_status,
			};
		}
		// 1. si llega solo el main_status
		if (newStatus.main_status) {
			const { main_status } = newStatus;
			await Postulation.findOneAndUpdate(
				{ _id },
				{ $set: { main_status: main_status } },
				{ new: true }
			);
			return {
				main_status,
				secondary_status: valid_secondary_status[0],
			};
		}
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the postulation UpdateStatus service. ${e.message}`
			)
		);
	}
};

/**
 * PARA GENERAR EL url_link2, actualiza Postulation y genera un docuemnto nuevo en la collecion video_recording_url
 */
export const GenerateUrl = async (postulation: IPostulation, next: NextFunction) => {
	try {
		const newUrl = await VideoRecordingUrl.create({});
		const token = createToken(postulation, JWT_VIDEO_TOKEN_EXP, "video", newUrl.short_url);

		const url_link_2 =
			NODE_ENV === "development"
				? `${REDIRECT_URL_DEVELOPMENT}/welcome?token=${token}`
				: `${REDIRECT_URL_PRODUCTION}/welcome?token=${token}`;

		await Postulation.findByIdAndUpdate(postulation._id, {
			video_recording_url: newUrl._id,
			url_link_2,
		});

		return token;
	} catch (e: any) {
		next(
			new InternalServerException(
				`There was an unexpected error with the GenerateUrl service. ${e.message}`
			)
		);
	}
};

export const DisableUrl = async (short_url: string, next: NextFunction): Promise<void> => {
	try {
		await VideoRecordingUrl.findOneAndUpdate({ short_url }, { isDisabled: true });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the url deletion service. ${e.message}`
			)
		);
	}
};

export const UploadVideoToS3 = async (file: Express.Multer.File, next: NextFunction) => {
	try {
		const fileStream = createReadStream(file.path);

		const uploadParams: UploadParams = {
			Bucket: AWS_VIDEO_BUCKET_NAME,
			Body: fileStream,
			Key: file.filename,
		};

		return await s3.upload(uploadParams).promise();
	} catch (e: any) {
		next(
			new InternalServerException(
				`There was an unexpected error with the video upload service, UploadVideoToS3 method. ${e.message}`
			)
		);
	}
};

export const SaveVideoKey = async (
	question_id: number,
	id: string,
	next: NextFunction,
	video_key: string
) => {
	try {
		await Postulation.findOneAndUpdate(
			{ _id: id, $and: [{ "video_questions_list.question_id": question_id }] },
			{ $set: { "video_questions_list.$.video_key": video_key } },
			{ upsert: true }
		);
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the candidate question and video key setting service SaveVideoKey method. ${e.message}`
			)
		);
	}
};

export const GetVideoFromS3 = (key: string, next: NextFunction) => {
	try {
		const getParams = {
			Bucket: AWS_VIDEO_BUCKET_NAME,
			Key: key,
		};

		const signedUrl: string = s3.getSignedUrl("getObject", getParams);
		return signedUrl;
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the video download service, GetVideoFromS3 method. ${e.message}`
			)
		);
	}
};
