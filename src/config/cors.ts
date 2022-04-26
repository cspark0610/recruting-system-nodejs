import { CorsOptions } from 'cors';
import envConfig from './env';

const { NODE_ENV } = envConfig;

const corsOptions: CorsOptions = {
  origin: NODE_ENV === 'development' ? '*' : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

export default corsOptions;
