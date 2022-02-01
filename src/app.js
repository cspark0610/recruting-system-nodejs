const express = require('express');
const morgan = require('morgan');

const routes = require('./video');

const app = express();

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));
app.use('/', routes);

module.exports = app;
