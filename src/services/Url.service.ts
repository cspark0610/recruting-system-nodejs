import Url from '../db/schemas/Url.schema';
import Candidate from '../db/schemas/Candidate.schema';
import IUrl from '../interfaces/schemas/IUrl.interface';
import ICandidate from '../interfaces/schemas/ICandidate.interface';
import IQuestion from '../interfaces/IQuestion.interface';

export const GenerateUrl = async (
  id: string,
  questions: Array<IQuestion>,
): Promise<{ newUrl: IUrl; newCandidate: ICandidate } | undefined> => {
  try {
    const newUrl: IUrl = await Url.create({});
    const newCandidate: ICandidate = await Candidate.create({
      id,
      videos_question_list: questions,
    });
    return { newUrl, newCandidate };
  } catch (e) {
    console.error(e);
  }
};

export const DeleteUrl = async (short_url: string): Promise<void> => {
  try {
    await Url.deleteOne({ short_url });
  } catch (e) {
    console.error(e);
  }
};
