import Url from '../db/schemas/Url.schema';
import User from '../db/schemas/User.schema';

const GenerateUrl = async (userId: string): Promise<any> => {
  try {
    const newUrl = await Url.create({});
    const newUser = await User.create({ id: userId });
    return { newUrl, newUser };
  } catch (e) {
    console.error(e);
  }
};

export default GenerateUrl;
