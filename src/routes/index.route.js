const router = require('express').Router();

const videoRoutes = require('./video.route');

router.get('', (_req, res) => {
  res.render('index');
});

//router.get(':shortUrl', (req: Request, res: Response) => {
//res.status(404).send({
//status: 'failure',
//code: 404,
//message: 'cannot GET /',
//});
//});

router.use('/video', videoRoutes);

module.exports = router;
