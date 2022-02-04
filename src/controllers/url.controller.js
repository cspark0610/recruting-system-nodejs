require('dotenv').config();

const {
  GetUrls,
  GetUniqueUrl,
  GenerateUrl,
} = require('../services/Url.service');

const getUrls = async (_req, res) => {
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
    const { id } = req.query;

    const uniqueUrlId = await GetUniqueUrl(id);

    if (!uniqueUrlId || Object.entries(uniqueUrlId).length === 0) {
      return res.status(404).send({
        status: 'failure',
        code: 404,
        message: 'Url not found. Probably not created yet or expired',
      });
    }

    res.redirect(uniqueUrlId.redirectUrl);
  } catch (e) {
    return res.send(e);
  }
};

const generateUrl = async (req, res) => {
  try {
    const { redirect_url } = req.body;

    if (!redirect_url) {
      return res.status(400).send({
        status: 'failure',
        code: 400,
        mesage: 'No base url was received',
      });
    }

    await GenerateUrl(redirect_url);

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
