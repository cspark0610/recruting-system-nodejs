import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

export default corsOptions;
