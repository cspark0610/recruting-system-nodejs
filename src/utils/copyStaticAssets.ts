import { cp } from 'shelljs';

cp('-R', 'views', 'dist');
cp('-R', 'uploads', 'dist');
