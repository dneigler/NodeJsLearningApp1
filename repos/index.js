/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 5/20/12
 * Time: 9:58 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
// var audit = require('./../controllers/audit-controller');

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  username:{ type:String, default:'' },
  firstname:{ type:String, default:'fn' }});

// var db = mongoose.connect("mongodb://localhost/node-mongo-examples");

var UserObj = mongoose.model('users', UserSchema);

// Clear users for now
UserObj.remove({}, function () {
});

exports.getUser = function (userId, res) {
  console.log('getUser called with userId ' + userId);
  var query = UserObj.find({});
  query.exec(function (err, docs) {
    console.log('Sending back ' + docs[0]);
    res(err, docs[0]);

  });
};

exports.saveUsers = function (users, callback) {
  console.log('saveUsers called with users ' + users);
  users.Rows.forEach(function (u) {
    //for (var u in users) {
    UserObj.findById(u._id, function (err, p) {
      if (!p)
        return next(new Error('Could not load document'));
      else {
        p.username = u.username;
        p.firstname = u.firstname;
        p.save(function (err) {
          if (err) {
            console.log('error ' + err);
            callback(err);
          } else
            console.log('success');
        })
      }
    })
  });
  callback(null);
};

exports.getUsers = function (req, res) {
  console.log('repos.getUsers called');
  var query = UserObj.find({});
  query.exec(function (err, docs) {
    // not sure how to pass results to view model, prob redirect?
    console.log('Sending back: ' + docs);
    // try wrapping it
    var wrapper = new Object();
    wrapper.Rows = docs;
    // audit.insertAuditTrail("GET USERS", "user", "User");

    res.render('index', { title:'Resource Manager', author:'Dave Neigler', userslist:wrapper });
  });
};

mongoose.connection.on('open', function () {
  console.log("mongodb connection open");

});

// init data
var seedUser = new UserObj();
seedUser.username = "DefaultUser";
seedUser.firstname = "FirstName";
seedUser.save(function (err) {
  if (err) {
    console.log('error: ' + err);
  } else {
    console.log('User saved: ' + seedUser);
  }
});

seedUser = new UserObj();
seedUser.username = "SecondUser";
seedUser.firstname = "FirstName2";
seedUser.save(function (err) {
  if (err) {
    console.log('error: ' + err);
  } else {
    console.log('User saved: ' + seedUser);
  }
});

exports.saveUser = function (req, res) {

  console.log('repos.saveUser called: ' + req.username);
  var newUser = new UserObj();
  newUser.username = req.body.username;
  newUser.firstname = req.body.username;

  newUser.save(function (err) {
    if (err) {
      console.log('error: ' + err);
    } else {
      console.log('User saved: ' + newUser);
    }
  });

};
