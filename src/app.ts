import express, { Application, Request, Response } from 'express';
import path from 'path';

const app: Application = express();

import routes from './routes/index.routes';

app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');

app.use('/', routes);
app.use('*', (_req: Request, res: Response) => {
  res.render('pages/pageNotFound');
});

export default app;
