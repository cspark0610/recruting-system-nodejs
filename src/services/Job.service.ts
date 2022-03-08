import Job from '../db/schemas/Job.schema';
import IJob from '../interfaces/schemas/IJob.interface';

const CreateJob = async (jobInfo: IJob) => {
  try {
    const newJob = await Job.create(jobInfo);

    return newJob;
  } catch (e) {
    console.error(e);
  }
};

export default CreateJob;
