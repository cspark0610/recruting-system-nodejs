import Url from '../db/schemas/Url.schema';
import UrlType from '../interfaces/Url.interface';

export const GetUniqueUrl = async (
  short_url: string,
): Promise<UrlType | null | undefined> => {
  try {
    const uniqueUrl: UrlType | null = await Url.findOne({ short_url });

    return uniqueUrl;
  } catch (e) {
    console.error(e);
  }
};

export const GenerateUrl = async (redirect_url: string): Promise<any> => {
  try {
    return await Url.create({ redirect_url });
  } catch (e) {
    console.error(e);
  }
};
