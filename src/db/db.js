const mongoose = require('mongoose');
require('dotenv').config();

if (process.env.NODE_ENV === 'development') {
  mongoose.connect(process.env.MONGODB_URL_DEVELOPMENT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

mongoose.connect(process.env.MONGODB_URL_PRODUCTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
