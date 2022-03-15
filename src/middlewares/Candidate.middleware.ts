import { Request, Response, NextFunction } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import Candidate from '../db/schemas/Candidate.schema';
import ICandidate from '../db/schemas/interfaces/ICandidate.interface';
import InternalServerException from '../exceptions/InternalServerError';
import BadRequestException from '../exceptions/BadRequestException';

export async function verifyCandidateExists(
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

export async function validateCV(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const cv = req.file;

  const unlinkFile = promisify(unlink);

  if (!cv) {
    return next(new BadRequestException('No cv was provided'));
  }

  if (cv.mimetype !== 'application/pdf') {
    await unlinkFile(cv.path);
    return next(new BadRequestException('Only pdf files are supported'));
  }

  next();
}
