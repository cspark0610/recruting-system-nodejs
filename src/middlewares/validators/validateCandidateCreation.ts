import { Request, Response, NextFunction } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import ICandidate from '../../db/interfaces/ICandidate.interface';

const unlinkFile = promisify(unlink);

export default async function validateCandidateCreation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const cv = req.file;
  // eslint-disable-next-line object-curly-newline
  const { name, email, phone, country }: ICandidate = req.body;

  if (!req.body || req.body === {}) {
    return res.status(400).send('Fields cannot be empty');
  }

  if (!name || !email || !phone || !country) {
    return res.status(400).send('There are empty fields');
  }

  if (!cv) {
    return res.status(400).send('No cv was received');
  }

  if (cv.mimetype !== 'application/pdf') {
    await unlinkFile(cv.path);
    return res.status(400).send('Only pdf files are supported.');
  }

  next();
}
