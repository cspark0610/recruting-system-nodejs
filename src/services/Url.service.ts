import Url from '../db/schemas/Url.schema';
import Candidate from '../db/schemas/Candidate.schema';
import IUrl from '../interfaces/IUrl.interface';
import ICandidate from '../interfaces/ICandidate.interface';
import IQuestion from '../interfaces/IQuestion.interface';

export const GenerateUrl = async (
  candidateId: string,
  questions: Array<IQuestion>,
): Promise<{ newUrl: IUrl; newCandidate: ICandidate } | undefined> => {
  try {
    const newUrl: IUrl = await Url.create({});
    const newCandidate: ICandidate = await Candidate.create({
      id: candidateId,
      videos_question_list: questions,
    });
    return { newUrl, newCandidate };
  } catch (e) {
    console.error(e);
  }
};

export const DeleteUrl = async (url_id: string): Promise<void> => {
  try {
    await Url.deleteOne({ short_url: url_id });
  } catch (e) {
    console.error(e);
  }
};
