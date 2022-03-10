/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
import IJob from '../interfaces/schemas/IJob.interface';
import * as urlService from '../services/Url.service';
import { CreateJob, SetCandidate, SetUrl } from '../services/Job.service';

export const createJob = async (req: Request, res: Response) => {
  const { title, designated }: IJob = req.body;

  try {
    const newJob = await CreateJob({ title, designated });

    if (!newJob) {
      return res.status(500).send('There was an error');
    }

    const jobUrl = await urlService.GenerateUrl();

    if (!jobUrl) {
      return res.status(500).send('There was an error');
    }

    const jobUpdated = await SetUrl(newJob._id, jobUrl.short_url);

    if (!jobUpdated) {
      return res.status(500).send('There was an error setting the url');
    }

    return res.status(201).send(jobUpdated);
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
