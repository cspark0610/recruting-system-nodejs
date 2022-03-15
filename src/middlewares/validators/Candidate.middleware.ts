import { Request, Response, NextFunction } from 'express';
import Candidate from '../../db/schemas/Candidate.schema';
import ICandidate from '../../db/interfaces/ICandidate.interface';
import InternalServerException from '../../exceptions/InternalServerError';
import BadRequestException from '../../exceptions/BadRequestException';

export default async function verifyCandidateExists(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { email }: ICandidate = req.body;

  try {
    const candidateExists = await Candidate.findOne({ email });

    if (candidateExists) {
      return next(
        new BadRequestException(
          `There is already a candidate registered with the email ${email}`,
        ),
      );
    }

    next();
  } catch (e: any) {
    return next(
      new InternalServerException(
        `There was an unexpected error with the candidate verification. ${e.message}. Please try again`,
      ),
    );
  }
}
