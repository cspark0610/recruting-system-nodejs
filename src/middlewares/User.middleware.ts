/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../db/schemas/interfaces/User';
import User from '../db/schemas/User.schema';
import Role from '../db/schemas/Role.schema';
import BadRequestException from '../exceptions/BadRequestException';
import InternalServerException from '../exceptions/InternalServerError';
import RequestExtended from '../interfaces/RequestExtended.interface';
import NotFoundException from '../exceptions/NotFoundException';

export async function validateSignUp(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { email }: IUser = req.body;

  try {
    const emailAt = email.split('@').pop();

    if (emailAt !== 'fulltimeforce.com') {
      return next(new BadRequestException('The emal is invalid'));
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      next(
        new BadRequestException(
          `There is already an user registered with the email ${email}`,
        ),
      );
    }

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error validating the user. ${e.message}`,
      ),
    );
  }
}

export async function validateNewRole(
  req: RequestExtended,
  _res: Response,
  next: NextFunction,
) {
  const { _id } = req.params;
  const { newRole } = req.body;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return next(
        new NotFoundException(
          `The user with the id ${_id} does not exist on the database`,
        ),
      );
    }

    const roleExists = await Role.findOne({ name: newRole });

    if (!roleExists) {
      return next(
        new NotFoundException(
          `The role ${newRole} does not exist on the database`,
        ),
      );
    }

    const rolesMatch = user.role?._id.equals(roleExists._id);

    if (rolesMatch) {
      return next(
        new BadRequestException(
          `The user ${user.name} already has the role '${newRole}' assigned`,
        ),
      );
    }

    req.role = roleExists._id;

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the new role validation. ${e.message}`,
      ),
    );
  }
}
