const router = require('express').Router();

const videoRoutes = require('./video.routes');
const urlRoutes = require('./url.routes');

router.get('', (_req, res) => {
  res.render('pages/index');
});

router.use('/video', videoRoutes);
router.use('/url', urlRoutes);

module.exports = router;
