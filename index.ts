import app from './src/app';
import './src/db/db';
import dotenv from 'dotenv';
dotenv.config();

const PORT: number | string = process.env.PORT || 3001;

console.log('database connected');
app.listen(PORT, () => console.log(`app running on PORT ${PORT}`));
