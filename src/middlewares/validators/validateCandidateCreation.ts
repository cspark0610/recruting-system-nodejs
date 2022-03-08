import { Request, Response, NextFunction } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';

const unlinkFile = promisify(unlink);

export default async function validateCandidateCreation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const cv = req.file;
  // eslint-disable-next-line object-curly-newline

  if (!cv) {
    return res.status(400).send('No cv was received');
  }

  if (cv.mimetype !== 'application/pdf') {
    await unlinkFile(cv.path);
    return res.status(400).send('Only pdf files are supported.');
  }

  next();
}
