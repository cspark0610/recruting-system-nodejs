import app from './src/app';
import dotenv from 'dotenv';
dotenv.config();

const PORT: number | string = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`app running on PORT ${PORT}`));
