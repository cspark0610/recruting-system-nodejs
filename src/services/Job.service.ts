import Job from '../db/schemas/Job.schema';
import Candidate from '../db/schemas/Candidate.schema';
import IJob from '../interfaces/schemas/IJob.interface';

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
    const job = await Job.findByIdAndUpdate(_id, {
      $push: { candidates: candidateId },
    });
    const candidate = await Candidate.findByIdAndUpdate(candidateId, {
      job: _id,
    });

    await job?.save();
    await candidate?.save();

    const allJobs = await Job.find({}).populate('candidates');
    const allCandidates = await Candidate.find({}).populate('job', 'title');

    const allData = await Promise.all([allJobs, allCandidates]);

    return allData;
  } catch (e) {
    console.error(e);
  }
};
