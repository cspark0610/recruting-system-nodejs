const path = require('path');

const router = require('express').Router();

router.get('', (req, res) => {
  res.render(path.join(__dirname, '../public/index.ejs'));
});

module.exports = router;
