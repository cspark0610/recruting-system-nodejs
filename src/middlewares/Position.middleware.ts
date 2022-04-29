import { Request, Response, NextFunction } from 'express';
import Position from '../db/schemas/Position.schema';
import User from '../db/schemas/User.schema';
import IPosition from '../db/schemas/interfaces/IPosition.interface';
import BadRequestException from '../exceptions/BadRequestException';
import InternalServerException from '../exceptions/InternalServerError';
import NotFoundException from '../exceptions/NotFoundException';
import RequestExtended from '../interfaces/RequestExtended.interface';

// checks if there is already a job created with the provided name before creation
export async function validatePositionExists(
  req: RequestExtended,
  _res: Response,
  next: NextFunction,
) {
  const { title, designated }: IPosition = req.body;

  try {
    const positionExists = await Position.findOne({ title });

    if (positionExists) {
      return next(
        new BadRequestException(
          `There is already a position registered with the name ${title}`,
        ),
      );
    }

    // checks if the designated users for job monitoring exists
    const designatedUsers = await User.find({
      name: { $in: designated },
    });

    if (designatedUsers.length === 0) {
      return next(
        new BadRequestException(`User(s) ${designated} not found in database`),
      );
    }

    req.designated = designatedUsers;

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the position verification. ${e.message}`,
      ),
    );
  }
}

export async function verifyPositionDeleted(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { _id } = req.params;

  try {
    const postionDeleted = await Position.findById(_id);

    if (!postionDeleted) {
      return next(
        new NotFoundException(
          `Position with id ${_id} not found. Probably it has already been deleted or has not been created yet.`,
        ),
      );
    }

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the postion deletion request. ${e.message}`,
      ),
    );
  }
}

export async function verifyPositionIsActive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.params;

  try {
    const position = await Position.findById(_id);

    if (position?.isActive === false) {
      return next(
        new BadRequestException(`Position ${position.title} is not active`),
      );
    }

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the postion isActive request. ${e.message}`,
      ),
    );
  }
}
