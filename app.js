/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongo = require('mongodb')
  , repos = require('./repos')
  , fs = require('fs')
  ;
var io1 = require('socket.io');

var config_file = require('yaml-config');
exports = module.exports = config = config_file.readConfig('config/config.yaml');

require('./db-connect');

// Bootstrap models
var models_path = __dirname + '/models';
var model_files = fs.readdirSync(models_path);
model_files.forEach(function (file) {
  if (file == 'User.js')
    User = require(models_path + '/' + file);
  else
    require(models_path + '/' + file);
});

var app = module.exports = express.createServer()
  , io = io1.listen(app);

require('./settings').boot(app)        // Bootstrap application settings

// Bootstrap repos
// every repo gets passed down to the controllers
var repos_path = __dirname + '/repos'
var repo_files = fs.readdirSync(repos_path);
repo_files.forEach(function (file) {
  console.log('requiring repo ' + repos_path + '/' + file);
  require(repos_path + '/' + file);
});

var audit = require('./lib/audit-utils');
audit.setIo(io);
audit.clearAudit();

// Bootstrap controllers
// every controller gets the same objects passed down - app, io, etc?
var controllers_path = __dirname + '/controllers'
var controller_files = fs.readdirSync(controllers_path)
controller_files.forEach(function (file) {
  console.log('requiring ' + controllers_path + '/' + file)
  // TODO: add the repositories here, otherwise it is explicit from controllers to repo which means no IOC behavior
  require(controllers_path + '/' + file)(app, io)
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello:'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('auditTrail', function (data) {
    // broadcast anything passed into auditTrail topic to all
    console.log("AUDITTRAIL: " + data);
    socket.broadcast.emit('auditTrail', data);
  });
});

// Start the app by listening on <port>
var port = process.env.PORT || 3000 //0
app.listen(port, function () {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
