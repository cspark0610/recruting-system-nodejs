/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
import { CreateJob, SetCandidate } from '../services/Job.service';
import IJob from '../db/interfaces/IJob.interface';

export const createJob = async (req: Request, res: Response) => {
  const { title, designated }: IJob = req.body;

  try {
    const newJob = await CreateJob({ title, designated });

    if (!newJob) {
      return res.status(500).send('There was an error');
    }

    return res.status(201).send(newJob);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const setCandidate = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const { candidateId } = req.body;

  try {
    const data = await SetCandidate(_id, candidateId);

    if (!data) {
      return res.status(500).send('There was an error. Please try again');
    }

    return res.status(200).send(data);
  } catch (e) {
    console.error(e);
  }
};
