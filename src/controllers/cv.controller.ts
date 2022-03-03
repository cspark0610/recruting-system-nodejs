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
      return res.status(404).send('No cv found');
    }

    candidateCV.pipe(res);
  } catch (e) {
    console.error(e);
  }
};

export const uploadCV = async (req: Request, res: Response) => {
  const cv = req.file;
  const userIndex = req.query.index as string;

  if (!cv) {
    return res.status(400).send({
      status: 'failure',
      code: 400,
      message: 'No cv was received',
    });
  }

  if (cv.mimetype !== 'application/pdf') {
    await unlinkFile(cv.path);
    return res.status(400).send('Only PDF files are supported');
  }

  try {
    const result = await UploadCV(cv);

    await unlinkFile(cv.path);
    await SaveCVKeysIntoUser(userIndex, result?.Key);
  } catch (e) {
    console.error(e);
  }

  return res.status(201).send('File uploaded successfully');
};
