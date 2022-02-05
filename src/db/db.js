const mongoose = require('mongoose');
require('dotenv').config();

if (process.env.NODE_ENV === 'development') {
  mongoose.connect(process.env.MONGODB_DEVELOPMENT_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} else if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_PRODUCTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
