import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import errorMiddleware from './middlewares/error.middleware';
import createRoles from './lib/createRoles';
import routes from './routes/index.routes';

const app: Application = express();

app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));
app.use(cors());
app.use(helmet());

createRoles();

app.use('/', routes);
app.use(errorMiddleware);

export default app;
