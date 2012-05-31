/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 5/30/12
 * Time: 10:17 PM
 * To change this template use File | Settings | File Templates.
 */

var routes = require('../routes'),
  repos = require('../repos'),
  audit = require('./audit-controller');

module.exports = function (app, io) {
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
        // publish out the updated auditTrail to everyone
        io.sockets.emit('auditTrail', getAudit("UpdateUsers"));
        res.send(d);
      }
    });
  });

  app.post('/signup', function (req, res) {
    repos.saveUser(req, res);
    audit.insertAuditTrail(io, "AddUser", getUser(req), "User");
    // io.sockets.emit('auditTrail', getAudit("AddUser"));
    console.log(req.body.data);

    //res.send(req.body);
    // let's save to database
    res.redirect('home');
  });


  function getUser(req) {
    if (req.session)
      return req.session.auth.name;// "USERNAME";
    return "NOT LOGGED IN";
  }

  function getAudit(actionName) {
    var auditItem = new Object();
    auditItem.Action = actionName;
    auditItem.User = "USERNAME";
    auditItem.Timestamp = new Date();
    return auditItem;
  }

  ;
}