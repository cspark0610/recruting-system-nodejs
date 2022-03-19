import ICorsOptions from '../interfaces/ICorsOptions.interface';

const corsOptions: ICorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

export default corsOptions;
