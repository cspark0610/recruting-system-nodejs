const app = require('./src/app');
require('dotenv').config();
require('./src/db/db');

const PORT = process.env.PORT || 3001;

console.log('server running');
app.listen(PORT, () => console.log(`app running on PORT ${PORT}`));
