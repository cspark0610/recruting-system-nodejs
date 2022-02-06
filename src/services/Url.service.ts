import Url from '../db/schemas/Url.schema';
import UrlType from '../interfaces/Url.interface';

export const GetUrls = async (): Promise<UrlType[] | undefined> => {
  try {
    const urls: UrlType[] | null = await Url.find();

    return urls;
  } catch (e) {
    console.error(e);
  }
};

export const GetUniqueUrl = async (
  url: string,
): Promise<UrlType | null | undefined> => {
  try {
    const uniqueUrl: UrlType | null = await Url.findOne({ shortUrl: url });

    return uniqueUrl;
  } catch (e) {
    console.error(e);
  }
};

export const GenerateUrl = async (redirect_url: string): Promise<any> => {
  try {
    return await Url.create({ redirectUrl: redirect_url });
  } catch (e) {
    console.error(e);
  }
};
