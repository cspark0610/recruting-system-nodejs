import Url from '../db/schemas/Url.schema';
import User from '../db/schemas/User.schema';
import IUrl from '../interfaces/IUrl.interface';
import IUser from '../interfaces/IUser.interface';
import IQuestion from '../interfaces/IQuestion.interface';

export const GenerateUrl = async (
  userId: string,
  questions: Array<IQuestion>,
): Promise<{ newUrl: IUrl; newUser: IUser } | undefined> => {
  try {
    const newUrl: IUrl = await Url.create({});
    const newUser: IUser = await User.create({
      id: userId,
      videos_question_list: questions,
    });
    return { newUrl, newUser };
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
