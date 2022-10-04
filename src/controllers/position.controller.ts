import * as positionService from '../services/Position.service';

import { BadRequestException, InternalServerException } from '../exceptions';
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express';

import { IPositionNormal } from '../db/schemas/interfaces/IPosition.interface';
import { RequestExtended } from '../interfaces';

export const getAllPositions = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, list, orderBy } = req.query;

    const parsedPage = parseInt(page as string, 10) || 1;
    const parsedLimit = parseInt(limit as string, 10) || 10;

    const positions = await positionService.GetAllPositions(
      next,
      list as string,
      parsedLimit,
      parsedPage,
      orderBy as string
    );
    console.log(positions);
    

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

  try {
    await positionService.UpdateInfo(_id, req.body, next);

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
