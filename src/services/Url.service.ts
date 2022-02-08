import Url from '../db/schemas/Url.schema';
import IUrl from '../interfaces/IUrl.interface';

export const ValidateUrl = async (
  short_url: string,
): Promise<IUrl | null | undefined> => {
  try {
    const uniqueUrl: IUrl | null = await Url.findOne({ short_url });

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
