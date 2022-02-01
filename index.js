const app = require('./src/app');
require('dotenv').config();

const { APP_PORT } = process.env || 3001;

app.listen(APP_PORT, () => console.log(`app running on PORT ${APP_PORT}`));
