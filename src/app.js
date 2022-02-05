const express = require('express');
const path = require('path');

const app = express();

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

const routes = require('./routes/index.route');

app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));
app.use(express.static(path.join(__dirname, '../views')));

app.set('view engine', 'ejs');

app.use('/', routes);

module.exports = app;
