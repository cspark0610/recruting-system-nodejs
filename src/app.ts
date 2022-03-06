import express, { Application, Request, Response } from 'express';
import path from 'path';
import routes from './routes/index.routes';

const app: Application = express();

app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/build', express.static(path.join(__dirname, '../build')));
app.use('/static', express.static(path.join(__dirname, '../build/static')));

app.set('view engine', 'ejs');

app.use('/', routes);
app.use('*', (_req: Request, res: Response) => {
  res.status(404).render('pages/pageNotFound');
});

export default app;
