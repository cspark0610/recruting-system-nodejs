import { Request, Response } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import UploadCV, { GetCV, SaveCVKeysIntoUser } from '../services/CV.service';

const unlinkFile = promisify(unlink);

export const getCV = async (req: Request, res: Response) => {
  const { key } = req.params;

  try {
    const candidateCV = await GetCV(key);

    if (!candidateCV) {
      return res.status(404).send({ message: 'No cv found' });
    }

    candidateCV.pipe(res);
  } catch (e) {
    console.error(e);
  }
};

export const uploadCV = async (req: Request, res: Response) => {
  const cv = req.file;
  const userId = req.query.user_id as string;

  if (!cv) {
    return res.status(400).send({ message: 'No cv was received' });
  }

  if (cv.mimetype !== 'application/pdf') {
    await unlinkFile(cv.path);
    return res.status(400).send({ message: 'Only PDF files are supported' });
  }

  try {
    const result = await UploadCV(cv);

    await unlinkFile(cv.path);
    await SaveCVKeysIntoUser(userId, result?.Key);

    return res.status(201).send({ message: 'CV uploaded successfully' });
  } catch (e) {
    console.error(e);
  }
};
