/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 5/20/12
 * Time: 9:58 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var io = require('socket.io');

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  username:{ type:String, default:'' },
  firstname:{ type:String, default:'fn' }});

var db = mongoose.connect("mongodb://localhost/node-mongo-examples");

var UserObj = mongoose.model('users', UserSchema);
UserObj.remove({}, function () {
});

/*
 module.exports = {
 _db: null,
 init: function(){
 if (!module.exports._db){
 var path = 'mongodb://' + SERVER_NAME + '/' + DB_NAME;
 console.log('connecting to MONGO via ' + path);
 module.exports._db = mongoose.connect(path);
 }
 return module.exports._db;
 }

 }
 module.exports.init = function(app) {

 global.SERVER_NAME = 'localhost:27017';
 global.DB_NAME = 'glitterwood'; // obviously localized to my app - choose your own
 require('./../models/db').load();
 */

/*

 var host = "localhost";
 var port = mongo.Connection.DEFAULT_PORT;
 var db = new mongo.Db('node-mongo-examples', new mongo.Server(host, port, {}), {});
 */

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

    res.render('index', { title:'Resource Manager', author:'Dave Neigler', userslist:wrapper });
  });
};

mongoose.connection.on('open', function () {
  console.log("mongodb connection open");

});


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