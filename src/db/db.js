const mongoose = require('mongoose');
require('dotenv').config();

if (process.env.NODE_ENV === 'development') {
  mongoose.connect(process.env.MONGODB_DEVELOPMENT_URI, (error) =>
    error ? console.error(error) : null,
  );
} else if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_PRODUCTION_URI, (error) =>
    error ? console.error(error) : null,
  );
}
