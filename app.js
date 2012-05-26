/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongo = require('mongodb')
  , repos = require('./repos');
var io1 = require('socket.io');

/*var host = "localhost";
 var port = mongo.Connection.DEFAULT_PORT;
 var db = new mongo.Db('node-mongo-examples', new mongo.Server(host, port, {}), {});

 db.open(function(err, db) {
 console.log(err);

 db.collection('users', function(err, collection) {
 if (err) console.log(err);
 collection.insert({username:'Bilbo', firstname:'Shilbo'}, function(err, docs) {
 console.log(docs);
 db.close();
 });
 });
 });*/

var app = module.exports = express.createServer()
//, appIo = express.createServer()
  , io = io1.listen(app);

//app.listen(3001);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello:'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('auditTrail', function (data) {
    console.log("AUDITTRAIL: " + data);
    socket.broadcast.emit('auditTrail', data);
  });
});

// Configuration

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

console.log("Starting in environment: " + process.env.NODE_ENV);
// Routes

app.get('/', routes.index);

app.param('id', function (req, res, next, id) {
  repos.getUser(id, function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('failed to find user'));
    req.user = user;
    next();
  });
});

app.get('/user/:id/edit', function (req, res) {
  res.send('editing ' + req.user.name);
});

app.post('/saveUsers', function (req, res) {
  console.log("called saveUsers with " + req.body);
  var d = JSON.parse(req.body.workaround); // req.body; //JSON.parse( req.body );
  console.log('attempt to saveUsers: ' + d);
  repos.saveUsers(d, function (err) {
    if (err)
      res.send("ERROR: " + err);
    else {
      io.sockets.emit('auditTrail', getAudit("UpdateUsers"));
      res.send(d);
    }
  });
  /*

   var auditItem = new Object();
   auditItem.Action = "SaveUsers";
   auditItem.User = "USERNAME";

   var socketAudit = io.connect();
   socketAudit.emit('auditTrail', auditItem);
   */

  // res.end(d);
  // res.end();
});

app.post('/signup', function (req, res) {
  repos.saveUser(req, res);
  io.sockets.emit('auditTrail', getAudit("AddUser"));
  console.log(req.body.data);

  //res.send(req.body);
  // let's save to database
  res.redirect('home');
});

app.listen(3000, function () {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

function getAudit(actionName) {
  var auditItem = new Object();
  auditItem.Action = actionName;
  auditItem.User = "USERNAME";
  auditItem.Timestamp = new Date();
  return auditItem;
}