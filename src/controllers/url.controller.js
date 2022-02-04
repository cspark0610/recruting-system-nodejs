const Url = require('../db/schemas/Url.schema');
require('dotnev').config();

const {
  GetUrls,
  GetUniqueUrl,
  GenerateUrl,
} = require('../services/Url.service');

const getUrls = async (req, res) => {
  try {
    const urls = await GetUrls();

    if (urls.length === 0) {
      return res.status(404).send({
        status: 'failure',
        code: 404,
        message: 'No urls found',
      });
    }

    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Urls found',
      urls,
    });
  } catch (e) {
    return res.send(e);
  }
};

const getUniqueUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;

    const uniqueUrl = await GetUniqueUrl(shortUrl);

    if (!uniqueUrl || Object.entries(uniqueUrl).length === 0) {
      return res.status(404).send({
        status: 'failure',
        code: 404,
        message: 'Url not found. Probably not created yet or expired',
      });
    }

    res.redirect(process.env.REDIRECT_URL);
  } catch (e) {
    return res.send(e);
  }
};

const generateUrl = async (req, res) => {
  try {
    await GenerateUrl(fullUrl);

    return res.status(201).send({
      status: 'success',
      code: 201,
      message: 'url created',
    });
  } catch (e) {
    return res.send(e);
  }
};

module.exports = {
  getUrls,
  getUniqueUrl,
  generateUrl,
};
