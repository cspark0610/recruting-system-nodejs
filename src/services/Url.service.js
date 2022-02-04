const Url = require('../db/schemas/Url.schema');

const GetUrls = async () => {
  try {
    const urls = await Url.find();

    return urls;
  } catch (e) {
    console.error(e);
  }
};

const GetUniqueUrl = async (url) => {
  try {
    const uniqueUrl = await Url.findOne({ shortUrl: url });

    return uniqueUrl;
  } catch (e) {
    console.error(e);
  }
};

const GenerateUrl = async (fullUrl) => {
  try {
    await Url.create({
      fullUrl: fullUrl,
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  GetUrls,
  GetUniqueUrl,
  GenerateUrl,
};
