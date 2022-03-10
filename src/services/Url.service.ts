import Url from '../db/schemas/UniqueUrl.schema';
import IUrl from '../interfaces/schemas/IUniqueUrl.interface';

export const GenerateUrl = async (): Promise<IUrl | undefined> => {
  try {
    const newUrl: IUrl = await Url.create({});
    return newUrl;
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
