import { AggregatePaginateResult, PaginateDocument, PaginateResult } from "mongoose";

import { IPositionNormal } from "../db/schemas/interfaces/IPosition.interface";
import { InternalServerException } from "../exceptions";
/* eslint-disable no-underscore-dangle */
import { NextFunction } from "express";
import Position from "../db/schemas/Position.schema";
import { RequestExtended } from "../interfaces";
import User from "../db/schemas/User.schema";
import { envConfig } from "../config";

// eslint-disable-next-line operator-linebreak
const { NODE_ENV, REDIRECT_URL_DEVELOPMENT, REDIRECT_URL_PRODUCTION } = envConfig;

const positionAggregates= {
	priority:(list:string)=>{
		return Position.aggregate([
			{$match:{
				isActive: (list === "active")
			}},{
        $addFields: {
            sortField: {
                $switch: {
                    branches: [
                        { case: { $eq: [ "$priority", "Low" ] }, then: 0 },
                        { case: { $eq: [ "$priority", "Normal" ] }, then: 1 },
                        { case: { $eq: [ "$priority", "High" ] }, then: 2 },
                        { case: { $eq: [ "$priority", "Urgent" ] }, then: 3 },
                    ],
                    default: -1
                }
            }
        }
    },
    {
        $sort: { sortField: -1 }
    }
		])
	}
}

export const GetAllPositions = async (
	next: NextFunction,
	list: string,
	limit?: number,
	page?: number,
	orderBy:string = "priority"
)=> {
	try {
		if (list === "all" || orderBy !== "priority") {
			return await Position.paginate();
		}

		const OrderedAggregate = positionAggregates[orderBy](list)
		return await Position.aggregatePaginate(OrderedAggregate, { page, limit });
		
	} catch (e: any) {
		console.log('err');
		
		next(new InternalServerException(`There was an unexpected error: ${e.message}`));
	}
};

export const GetPositionInfo = async (_id: string, next: NextFunction) => {
	try {
		return await Position.findById(_id);
	} catch (e: any) {
		next(
			new InternalServerException(
				`There was an unexpected error with the GetJobInfo service: ${e.message}`
			)
		);
	}
};

//IPositionNormal,
export const Create = async (positionInfo: any, next: NextFunction, req: RequestExtended) => {
	try {
		const newPosition = await Position.create({
			...positionInfo,
			designated: req?.designated?.map((user) => user._id),
		});

		// creates the job application url once the job is created
		const newPositionWithUrl = await Position.findByIdAndUpdate(
			newPosition._id,
			{
				url:
					NODE_ENV === "development"
						? `${REDIRECT_URL_DEVELOPMENT}/apply?position_id=${newPosition._id}`
						: `${REDIRECT_URL_PRODUCTION}/apply?position_id=${newPosition._id}`,
			},
			{ new: true }
		);

		return newPositionWithUrl;
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the position creation service. ${e.message}`
			)
		);
	}
};

export const UpdateInfo = async (_id: string, newInfo: IPositionNormal, next: NextFunction) => {
	try {
		const designated = await User.find({ name: { $in: newInfo.designated } });

		const users = designated?.map((user) => user._id);

		await Position.findByIdAndUpdate(_id, { ...newInfo, designated: users });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the position update service. ${e.message}`
			)
		);
	}
};

export const SetIsActive = async (_id: string, next: NextFunction) => {
	try {
		const currentPositionStatus = await Position.findById(_id);
		await Position.findByIdAndUpdate(_id, {
			isActive: !currentPositionStatus!.isActive,
		});
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the position status update service. ${e.message}`
			)
		);
	}
};

export const Delete = async (_id: string, next: NextFunction) => {
	try {
		await Position.findOneAndRemove({ _id });
	} catch (e: any) {
		return next(
			new InternalServerException(
				`There was an unexpected error with the position deletion service. ${e.message}`
			)
		);
	}
};
