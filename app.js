var express = require('express');
var path = require('path');
const cors = require('cors')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var pushRouter = require('./routes/push');

var app = express();

app.use(logger('dev'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/_register', registerRouter);
app.use('/push/', pushRouter);

module.exports = app;
