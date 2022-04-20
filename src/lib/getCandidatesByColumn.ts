import ICandidate from '../db/schemas/interfaces/ICandidate.interface';

const getCandidatesByColumn = (candidates: ICandidate[]) => {
  const interestedCandidates = candidates.filter(
    (candidate: ICandidate) => candidate.main_status === 'interested',
  );
  const applyingCandidates = candidates.filter(
    (candidate: ICandidate) => candidate.main_status === 'applying',
  );
  const meetingCandidates = candidates.filter(
    (candidate: ICandidate) => candidate.main_status === 'meeting',
  );
  const chosenCandidates = candidates.filter(
    (candidate: ICandidate) => candidate.main_status === 'chosen',
  );

  return {
    interestedCandidates,
    applyingCandidates,
    meetingCandidates,
    chosenCandidates,
  };
};

export default getCandidatesByColumn;
