import Url from '../db/schemas/Url.schema';
import User from '../db/schemas/User.schema';

const GenerateUrl = async (
  redirect_url: string,
  userId: string,
): Promise<any> => {
  try {
    const newUrl = await Url.create({ redirect_url });
    const newUser = await User.create({ id: userId });
    return { newUrl, newUser };
  } catch (e) {
    console.error(e);
  }
};

export default GenerateUrl;
