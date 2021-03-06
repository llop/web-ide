//----------------------------------------------
// Express webserver
//----------------------------------------------

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//----------------------------------------------
// Express app setup
//----------------------------------------------

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// if we are gonna be using Angular, the double curly braces are gonna be a problem
// from now on, in html templates: <% var %> must be used instead of {{ title }} to write text
//                                 to write raw html, use <%{ title }%> instead of {{{ title }}}
app.locals.delimiters = '<% %>';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// public folders
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));


//----------------------------------------------
// socket.io setup
// http://stackoverflow.com/questions/24609991/using-socket-io-in-express-4-and-express-generators-bin-www
// + gdb setup
//----------------------------------------------

var socketio = require('socket.io');
var io = socketio();
app.io = io;


//require('./controllers/cpp-socket')(app, io);
require('./controllers/workspace-controller')(io);
require('./controllers/cpp-controller')(io);
require('./controllers/haskell-controller')(io);


//----------------------------------------------
// Routes
//----------------------------------------------
var routes = require('./routes/index');
var wfile = require('./routes/wfile');
var debug = require('./routes/debug');
//var users = require('./routes/users');

app.use('/', routes);
app.use('/wfile', wfile);
app.use('/debug', debug(app.gdb));
//app.use('/users', users);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
