/* eslint-disable object-curly-newline */
import { Request, Response } from 'express';
import ICandidate from '../interfaces/schemas/ICandidate.interface';
import CreateCandidate from '../services/Candidate.Service';
import UploadCV from '../services/CV.service';

const createCandidate = async (req: Request, res: Response) => {
  const cv = req.file;
  const { id, name, email, phone, country }: ICandidate = req.body;

  if (!cv) {
    return res.status(400).send('no cv received');
  }

  const result = await UploadCV(cv);

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
};

export default createCandidate;
