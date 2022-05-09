/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from 'express';
import { IPositionNormal } from '../db/schemas/interfaces/IPosition.interface';
import InternalServerException from '../exceptions/InternalServerError';
import RequestExtended from '../interfaces/RequestExtended.interface';
import BadRequestException from '../exceptions/BadRequestException';
import NotFoundException from '../exceptions/NotFoundException';
import * as positionService from '../services/Position.service';

export const getAllPositions = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page } = req.query;
    const parsedPage = parseInt(page as string, 10);

    const positions = await positionService.GetAllPositions(next, parsedPage);

    if (!positions || positions.length === 0) {
      return next(new NotFoundException('No positions found'));
    }

    res.status(200).send({ status: 200, data: positions });
  } catch (e: any) {
    next(new InternalServerException(e));
  }
};

export const getPositionInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;

  try {
    const positionInfo = await positionService.GetPositionInfo(_id, next);

    return res.status(200).send({ status: 200, positionInfo });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the getPositionInfo controller. ${e.message}`,
      ),
    );
  }
};

export const create = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  const {
    title,
    designated,
    client_name,
    rie_link,
    recruiter_filter,
    priority,
  }: IPositionNormal = req.body;

  try {
    const newPosition = await positionService.Create(
      {
        title,
        designated,
        client_name,
        rie_link,
        recruiter_filter,
        priority,
      },
      next,
      req,
    );

    if (!newPosition) {
      return next(
        new InternalServerException(
          'There was an error creation the position. Please try again',
        ),
      );
    }

    return res.status(201).send({ status: 201, newPosition });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the position creation controller. ${e.message}`,
      ),
    );
  }
};

export const updateInfo = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;
  const {
    title,
    designated,
    client_name,
    rie_link,
    recruiter_filter,
    skills_required,
    video_questions_list,
  }: IPositionNormal = req.body;

  try {
    await positionService.UpdateInfo(
      _id,
      {
        title,
        designated,
        client_name,
        rie_link,
        recruiter_filter,
        skills_required,
        video_questions_list,
      },
      next,
    );

    return res
      .status(200)
      .send({ status: 200, message: 'Position updated successfully' });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the position update controller. ${e.message}`,
      ),
    );
  }
};

export const setIsActive = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;

  try {
    await positionService.SetIsActive(_id, next);

    return res
      .status(200)
      .send({ status: 200, message: 'Position status updated successfully' });
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the position status update controller. ${e.message}`,
      ),
    );
  }
};

export const deletePosition = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.params;

  if (!_id) {
    return next(new BadRequestException('No position id was provided'));
  }

  try {
    await positionService.Delete(_id, next);
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the position deletion controller. ${e.message}`,
      ),
    );
  }
  return res
    .status(200)
    .send({ status: 200, message: 'Position deleted successfully' });
};
