const path = require('path');

const router = require('express').Router();

router.get('', (req, res) => {
  console.log(__dirname);
  res.render(path.join(__dirname, '../public/index.ejs'));
});

module.exports = router;
