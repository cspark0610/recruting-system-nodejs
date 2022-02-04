const router = require('express').Router();

const {
  getUrls,
  getUniqueUrl,
  generateUrl,
} = require('../controllers/url.controller');

router.get('/get', getUrls);

router.get('/get/:shortUrl', getUniqueUrl);

router.post('/create', generateUrl);

module.exports = router;
