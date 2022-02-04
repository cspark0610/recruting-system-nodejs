const express = require('express');
const path = require('path');
const cors = require('cors');

const routes = require('./routes/index.route');
//import setHeaders from './middlewares/setHeaders';

const app = express();

app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));
app.use(express.static(path.join(__dirname, '../views')));
//app.use(cors);

app.set('view engine', 'ejs');

app.use('/', routes);

module.exports = app;
