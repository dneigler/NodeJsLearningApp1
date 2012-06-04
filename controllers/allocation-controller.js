/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 5/30/12
 * Time: 10:17 PM
 * To change this template use File | Settings | File Templates.
 */

var routes = require('../routes'),
  repos = require('../repos'),
  audit = require('./../lib/audit-utils'),
  ioLocal;

module.exports = function (app, io) {
  ioLocal = io;

  app.get('/', function (req, res) {
    // for now get audit trail after users
    repos.getUsers(function (users) {
      // TODO: find a way to execute both queries simultaneously
      audit.insertAuditTrail("GetUsers", getUser(req), "User", function () {
        audit.getAll(function (at) {
          res.render('index', { title:'Resource Manager', author:'Dave Neigler', userslist:users, auditTrail:at });
        });
      });
    });
  });

  app.param('username', function (req, res, next, id) {
    repos.getUser(id, function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('failed to find user'));
      req.user = user;
      next();
    });
  });

  app.get('/user/:username/edit', function (req, res) {
    // repos.getUser(userId, callback
    // so I'm guessing the reason this works is that we already populated req.user in the app.param('id') code above.
    res.send('editing ' + req.user.username);
  });

  app.post('/saveUsers', function (req, res) {
    console.log("called saveUsers with " + req.body);
    var d = JSON.parse(req.body.workaround);
    console.log('attempt to saveUsers: ' + d);
    repos.saveUsers(d, function (err) {
      if (err)
        res.send("ERROR: " + err);
      else {
        // publish the update
        if (ioLocal)
          ioLocal.sockets.emit('Users', d);
        // publish out the updated auditTrail to everyone
        audit.insertAuditTrail("UpdateUsers", getUser(req), "User", function () {
          res.send(d);
        });
      }
    });
  });

  app.post('/signup', function (req, res) {
    repos.saveUser(req, res);
    repos.getUser(req.body.username, function (err, docs) {
      if (ioLocal)
        ioLocal.sockets.emit('NewUser', docs);
    });
    audit.insertAuditTrail("AddUser", getUser(req), "User", function () {
      console.log(req.body.data);
    });
    // io.sockets.emit('auditTrail', getAudit("AddUser"));

    //res.send(req.body);
    // let's save to database
    res.redirect('home');
  });


  function getUser(req) {
    if (req.session)
      return req.session.auth.name;// "USERNAME";
    return "NOT LOGGED IN";
  }


  ;
}