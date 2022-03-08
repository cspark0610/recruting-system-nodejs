import { Request, Response } from 'express';
import ICandidate from '../interfaces/schemas/ICandidate.interface';
import CreateCandidate from '../services/Candidate.Service';

const createCandidate = async (req: Request, res: Response) => {
  // eslint-disable-next-line object-curly-newline
  const { id, name, email, phone, country }: ICandidate = req.body;

  const data = await CreateCandidate({
    id,
    name,
    email,
    phone,
    country,
  });

  if (!data) {
    return res.status(500).send({
      message: 'There was an error creating the candidate. Please try again',
    });
  }

  return res.status(201).send(data);
};

export default createCandidate;
