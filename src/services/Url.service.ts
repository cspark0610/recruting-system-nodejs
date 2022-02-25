import Url from '../db/schemas/Url.schema';
import User from '../db/schemas/User.schema';

export const GenerateUrl = async (userId: string): Promise<any> => {
  try {
    const newUrl = await Url.create({});
    const newUser = await User.create({ id: userId });
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
