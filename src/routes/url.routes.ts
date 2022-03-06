import { Router } from 'express';

import * as urlController from '../controllers/url.controller';

import validateUrl from '../middlewares/validators/validateUrl';
import validateUrlCreationParams from '../middlewares/validators/validateUrlCreationParams';
import validateUrlDeletion from '../middlewares/validators/validateUrlDeletion';

import urlCreation from '../middlewares/requests/urlCreation';

const router = Router();

router.get('/validate', validateUrl, urlController.renderApp);
router.get('/validate/error/not-valid', urlController.renderNotValidUrl);
router.get(
  '/create',
  urlCreation,
  validateUrlCreationParams,
  urlController.generateUrl,
);

router.delete('/delete/:url_id', validateUrlDeletion, urlController.deleteUrl);

export default router;
