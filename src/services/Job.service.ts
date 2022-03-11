/* eslint-disable no-underscore-dangle */
import dotenv from 'dotenv';
import Job from '../db/schemas/Job.schema';
import Candidate from '../db/schemas/Candidate.schema';
import IJob from '../db/interfaces/IJob.interface';

dotenv.config();

// eslint-disable-next-line operator-linebreak
const { NODE_ENV, REDIRECT_URL_DEVELOPMENT, REDIRECT_URL_PRODUCTION } =
  process.env;

export const CreateJob = async (jobInfo: IJob) => {
  try {
    const newJob = await Job.create(jobInfo);
    const newJobWithUrl = await Job.findByIdAndUpdate(newJob._id, {
      url:
        NODE_ENV === 'development'
          ? `${REDIRECT_URL_DEVELOPMENT}/info-upload?job_id=${newJob._id}`
          : `${REDIRECT_URL_PRODUCTION}/info-upload?job_id=${newJob._id}`,
    });

    return newJobWithUrl;
  } catch (e) {
    console.error(e);
  }
};

export const SetCandidate = async (_id: string, candidateId: string) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(candidateId, {
      job: _id,
    });

    await candidate?.save();

    const allCandidates = await Candidate.find({});

    return allCandidates;
  } catch (e) {
    console.error(e);
  }
};
