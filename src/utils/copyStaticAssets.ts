import { cp } from 'shelljs';

cp('-R', 'public', 'dist');
cp('-R', 'views', 'dist');
cp('-R', 'uploads', 'dist');
cp('-R', 'downloads', 'dist');
