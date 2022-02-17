import Url from '../db/schemas/Url.schema';
import User from '../db/schemas/User.schema';

const GenerateUrl = async (
  redirect_url: string,
  userId: string,
): Promise<any> => {
  try {
    const newUrl = await Url.create({ redirect_url });
    await User.create({ id: userId });
    return newUrl;
  } catch (e) {
    console.error(e);
  }
};

export default GenerateUrl;
