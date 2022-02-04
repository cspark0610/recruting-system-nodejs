const router = require('express').Router();

router.get('/get/:shortUrl', (req, res) => {
  res.status(404).send({
    status: 'failure',
    code: 404,
    message: 'Cannot GET /url/get',
  });
});

module.exports = router;
