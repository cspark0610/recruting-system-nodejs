import { Request, Response, NextFunction } from 'express';
import User from '../../db/schemas/User.schema';
import IUser from '../../db/interfaces/User/IUser.interface';
import Candidate from '../../db/schemas/Candidate.schema';
import ICandidate from '../../db/interfaces/ICandidate.interface';
import BadRequestException from '../../exceptions/BadRequestException';
import InternalServerException from '../../exceptions/InternalServerError';
import temp from '../../lib/tempVariables';

export default async function validateSignUp(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { email }: IUser = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      next(new BadRequestException(`User already in use with email ${email}`));
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

export async function validateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).send('No candidate id was received');
    }

    const candidate: ICandidate | null = await Candidate.findOne({
      id: candidateId,
    });

    if (!candidate) {
      return res.status(404).send({
        status: 'failure',
        code: 404,
        message: `Candidate not found with id ${candidateId}`,
      });
    }

    if (candidate?.videos_question_list?.length !== 3) {
      const recordedVideos = candidate?.videos_question_list?.length;

      return res.status(400).send({
        status: 'failure',
        code: 400,
        message: `Candidate has been found, but has not recorded all their videos. Currently they have recorded ${recordedVideos} out of 3`,
      });
    }

    temp.video_data = candidate.videos_question_list;
    temp.cv = candidate.cv;

    next();
  } catch (e: any) {
    console.error(e);
  }
}
