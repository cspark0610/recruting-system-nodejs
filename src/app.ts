import express, { Application } from 'express';
import errorMiddleware from './middlewares/error.middleware';
import routes from './routes/index.routes';

const app: Application = express();

app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));

app.use('/', routes);
app.use(errorMiddleware);

export default app;
