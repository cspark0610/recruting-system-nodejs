import dotenv from 'dotenv';
import app from './src/app';
import './src/db/db';

dotenv.config();

const PORT: number | string = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
