import ICandidate from '../db/schemas/interfaces/ICandidate.interface';

export type ResponseData = {
  interestedCandidates: Array<ICandidate>;
  applyingCandidates: Array<ICandidate>;
  meetingCandidates: Array<ICandidate>;
  chosenCandidates: Array<ICandidate>;
};

const checkIsEmptyObject = (response: ResponseData): boolean => {
  return (
    response.interestedCandidates.length === 0 &&
    response.applyingCandidates.length === 0 &&
    response.meetingCandidates.length === 0 &&
    response.chosenCandidates.length === 0
  );
};

export default checkIsEmptyObject;
