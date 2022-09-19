import { NextFunction } from "express";
import { decodeToken } from "../lib/jwt";
import IPostulation from "../db/schemas/interfaces/IPostulation.interface";
import {
	NotFoundException,
	InternalServerException,
	BadRequestException,
	InvalidAccessToken,
} from "../exceptions";
import Postulation from "../db/schemas/Postulation.schema";
import VideoRecordingUrlSchema from "../db/schemas/VideoRecordingUrl.schema";
import { RequestExtended } from "../interfaces";

//{ params: { _id: any }; postulation: IPostulation },
export async function verifyPostulationExistsBeforeUrlGeneration(
	req: RequestExtended,
	_res: Response,
	next: NextFunction
) {
	const { _id } = req.params;

	try {
		const postulation = await Postulation.findById(_id);

		if (!postulation) {
			return next(new NotFoundException(`No postulation was found with the id ${_id}`));
		}

		req.postulation = postulation as unknown as IPostulation;

		next();
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error verifying the postulation "verifyPostulationExistsBeforeUrlGeneration". ${e.message}`
			)
		);
	}
}

export async function verifyIfPostulationUrlIsDisabled(
	req: { params: { url_id: any } },
	_res: Response,
	next: NextFunction
) {
	const { url_id } = req.params;

	try {
		const videoUrl = await VideoRecordingUrlSchema.findOne({
			short_url: url_id,
		});

		if (!videoUrl) {
			return next(
				new BadRequestException(
					`No video url found with id ${url_id} "verifyIfPostulationUrlIsDisabled"`
				)
			);
		}

		if (videoUrl.isDisabled) {
			return next(
				new BadRequestException(
					`The video url is already disabled "verifyIfPostulationUrlIsDisabled"`
				)
			);
		}

		next();
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error verifying the candidate. ${e.message}`
			)
		);
	}
}

export async function validatePostulationJwt(
	req: { query: { token: string } },
	_res: Response,
	next: NextFunction
) {
	const token = req.query.token;

	try {
		const decoded = decodeToken(token, "video");

		const postulation = await Postulation.findById(decoded._id);
		const url = await VideoRecordingUrlSchema.findOne({
			short_url: decoded.url_id,
		});

		if (!postulation || url?.isDisabled) {
			return next(
				new InvalidAccessToken(
					`${JSON.stringify(url)} disabled or postulation not found "validatePostulationJwt"`
				)
			);
		}

		next();
	} catch (e: any) {
		return next(new InvalidAccessToken(e.message));
	}
}
