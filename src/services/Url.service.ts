import Url from '../db/schemas/Url.schema';

const GenerateUrl = async (redirect_url: string): Promise<any> => {
  try {
    return await Url.create({ redirect_url });
  } catch (e) {
    console.error(e);
  }
};

export default GenerateUrl;
