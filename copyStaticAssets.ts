import * as shelljs from 'shelljs';

shelljs.cp('-R', 'public/js', 'dist/public');
shelljs.cp('-R', 'public/css', 'dist/public');
shelljs.cp('-R', 'views', 'dist');
shelljs.cp('-R', 'uploads', 'dist');
shelljs.cp('-R', 'downloads', 'dist');
