const router = require('express').Router();

const videoRoutes = require('./video.route');
const urlRoutes = require('./url.route');

router.get('', (_req, res) => {
  res.render('pages/index');
});

router.use('/video', videoRoutes);
router.use('/url', urlRoutes);

module.exports = router;
