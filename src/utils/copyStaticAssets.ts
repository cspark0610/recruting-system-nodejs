import * as shelljs from 'shelljs';

shelljs.cp('-R', 'public', 'dist');
shelljs.cp('-R', 'views', 'dist');
shelljs.cp('-R', 'uploads', 'dist');
shelljs.cp('-R', 'downloads', 'dist');
