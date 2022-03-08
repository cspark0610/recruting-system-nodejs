import { Request, Response } from 'express';
import IJob from '../interfaces/schemas/IJob.interface';
import CreateJob from '../services/Job.service';

const createJob = async (req: Request, res: Response) => {
  const { title, designated }: IJob = req.body;

  try {
    const newJob = await CreateJob({ title, designated });

    if (!newJob) {
      return res.status(400).send('There was an error');
    }

    return res.status(201).send(newJob);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export default createJob;
