const express = require('express');
const path = require('path');
const morgan = require('morgan');

const routes = require('./routes/index.route');

const app = express();

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.set('view engine', 'ejs');
app.set('public', path.join(__dirname, 'public'));

module.exports = app;
