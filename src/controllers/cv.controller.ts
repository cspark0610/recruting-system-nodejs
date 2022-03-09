import { Request, Response } from 'express';
import { GetCV } from '../services/CV.service';

const getCV = async (req: Request, res: Response) => {
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
export default getCV;
