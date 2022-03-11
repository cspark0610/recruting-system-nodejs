import Candidate from '../db/schemas/Candidate.schema';
import ICandidate from '../db/interfaces/ICandidate.interface';

const CreateCandidate = async (candidateInfo: ICandidate) => {
  try {
    const newCandidate = await Candidate.create(candidateInfo);

    return newCandidate;
  } catch (e: any) {
    console.error(e);
  }
};

export default CreateCandidate;
