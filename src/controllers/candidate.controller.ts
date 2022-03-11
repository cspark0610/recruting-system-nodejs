/* eslint-disable object-curly-newline */
import { Request, Response } from 'express';
import { unlink } from 'fs';
import { promisify } from 'util';
import ICandidate from '../db/interfaces/ICandidate.interface';
import CreateCandidate from '../services/Candidate.Service';
import { GetCV, UploadCV } from '../services/CV.service';

const unlinkFile = promisify(unlink);

export const createCandidate = async (req: Request, res: Response) => {
  const cv = req.file;
  const { id, name, email, phone, country }: ICandidate = req.body;

  if (!cv) {
    return res.status(400).send('no cv received');
  }

  try {
    const result = await UploadCV(cv);
    await unlinkFile(cv.path);

    const cvKey = result?.Key;

    const data = await CreateCandidate({
      id,
      name,
      email,
      phone,
      country,
      cv: cvKey,
    });

    if (!data) {
      return res.status(500).send({
        message: 'There was an error creating the candidate. Please try again',
      });
    }

    return res.status(201).send(data);
  } catch (e: any) {
    console.error(e);
  }
};

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
