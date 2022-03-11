import Job from '../db/schemas/Job.schema';
import Candidate from '../db/schemas/Candidate.schema';
import IJob from '../db/interfaces/IJob.interface';

export const CreateJob = async (jobInfo: IJob) => {
  try {
    const newJob = await Job.create(jobInfo);

    return newJob;
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
