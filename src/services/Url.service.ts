import Url from '../db/schemas/Url.schema';

export const GetUrls = async () => {
  try {
    const urls = await Url.find();

    return urls;
  } catch (e) {
    console.error(e);
  }
};

export const GetUniqueUrl = async (url: string) => {
  try {
    const uniqueUrl = await Url.findOne({ shortUrl: url });

    return uniqueUrl;
  } catch (e) {
    console.error(e);
  }
};

export const GenerateUrl = async (redirect_url: string) => {
  try {
    return await Url.create({ redirectUrl: redirect_url });
  } catch (e) {
    console.error(e);
  }
};
