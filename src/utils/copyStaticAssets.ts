// copies the uploads folder into the dist folder once the TypeScript build process is finished
import { cp } from 'shelljs';

cp('-R', 'uploads', 'dist');
