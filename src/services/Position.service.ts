/* eslint-disable no-underscore-dangle */
import { NextFunction } from 'express';
import envConfig from '../config/env';
import Position from '../db/schemas/Position.schema';
import IPosition from '../db/schemas/interfaces/IPosition.interface';
import InternalServerException from '../exceptions/InternalServerError';
import RequestExtended from '../interfaces/RequestExtended.interface';

// eslint-disable-next-line operator-linebreak
const { NODE_ENV, REDIRECT_URL_DEVELOPMENT, REDIRECT_URL_PRODUCTION } =
  envConfig;

export const GetAllPositions = async (next: NextFunction) => {
  try {
    return await Position.find();
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an unexpected error: ${e.message}`,
      ),
    );
  }
};

export const GetPositionInfo = async (_id: string, next: NextFunction) => {
  try {
    return await Position.findById(_id, { title: 1, designated: 0 });
  } catch (e: any) {
    next(
      new InternalServerException(
        `There was an unexpected error with the GetJobInfo service: ${e.message}`,
      ),
    );
  }
};

export const Create = async (
  positionInfo: IPosition,
  next: NextFunction,
  req: RequestExtended,
) => {
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
          NODE_ENV === 'development'
            ? `${REDIRECT_URL_DEVELOPMENT}/info-upload?job_id=${newPosition._id}`
            : `${REDIRECT_URL_PRODUCTION}/info-upload?job_id=${newPosition._id}`,
      },
      { new: true },
    );

    return newPositionWithUrl;
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the position creation service. ${e.message}`,
      ),
    );
  }
};

export const UpdateInfo = async (
  _id: string,
  newInfo: IPosition,
  next: NextFunction,
) => {
  try {
    await Position.findByIdAndUpdate(_id, newInfo);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the position update service. ${e.message}`,
      ),
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
        `There was an unexpected error with the position status update service. ${e.message}`,
      ),
    );
  }
};

export const Delete = async (_id: string, next: NextFunction) => {
  try {
    await Position.findOneAndRemove({ _id });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the position deletion service. ${e.message}`,
      ),
    );
  }
};