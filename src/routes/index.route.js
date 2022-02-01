const path = require('path');

const router = require('express').Router();

router.get('', (_req, res) => {
  res.render(path.join(__dirname, '../public/index.ejs'));
});

module.exports = router;
