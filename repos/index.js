/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 5/20/12
 * Time: 9:58 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
// var audit = require('../controllers/audit-controller');

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  username:{ type:String, default:'' },
  firstname:{ type:String, default:'fn' }});

// var db = mongoose.connect("mongodb://localhost/node-mongo-examples");

var UserObj = mongoose.model('users', UserSchema);
var AllocObj = mongoose.model('ResourceAllocation');// , ResourceAllocationSchema);
var StatusObj = mongoose.model('ProjectStatus');

// Clear users for now∆
UserObj.remove({}, function () {
});

exports.getUser = function (username, callback) {
  console.log('getUser called with username: ' + username);
  var query = UserObj.find({'username':username});
  query.exec(function (err, docs) {
    console.log('Sending back ' + docs[0]);
    if (callback)
      callback(err, docs[0]);

  });
};

exports.getUserAllocs = function(user, callback) {
  console.log('getUserAllocs called for ' + user);
  var query = AllocObj.find({'Name':user.username})
    .populate('Employee'); //'username':user})
  query.exec(function(err, docs) {
    console.log('Sending back ' + docs);
    var wrapper = new Object();
    wrapper.Rows = docs;
    if (callback)
      callback(err, wrapper);
  });
};

exports.saveUserAllocs = function(allocs, callback) {
  console.log('saveUserAllocs called with allocs ' + allocs);
  allocs.forEach(function(a) {
    // following isn't found
    console.log('attempting to save ' + JSON.stringify(a));//  a.stringify());
    // we can't save the _id prop
    var id = a._id;
    delete a._id;
    AllocObj.update({_id:id}, { $set: a }, { upsert: true, safe: true }, function(err, data) {
      if (err)
        console.log('ERR: ' + err);
      else
        console.log('finished update: ' + data);
      callback();//.apply(this, arguments);
    });
    
  });
  //callback();
};

exports.getProjectStatusItems = function(statusDate, callback) {
  console.log('called getProjectStatusItems');
  var query = StatusObj.find({'StatusDate':statusDate});
  query.exec(function(err, docs) {
    callback(err, docs);
  });
};

exports.saveProjectStatusItems = function(statusItems, callback) {
  console.log('saveProjectStatusItems called ' + statusItems.length);
  statusItems.forEach(function(item) {
    var query = StatusObj.find({'StatusDate':item.StatusDate, 'Note':item.Note});
    query.exec(function(err, docs) {
      //console.log('')
      if (docs.length == 0) { // create
        var obj = new StatusObj(item);
        obj.save(item, function(err) {
          if (err)
            console.log('ERROR: ' + err);
        })
      }
    });

  });
  callback();
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

exports.getUsers = function (callback) {
  console.log('repos.getUsers called');
  var query = UserObj.find({});
  query.exec(function (err, docs) {

    // not sure how to pass results to view model, prob redirect?
    console.log('Sending back: ' + docs);
    // try wrapping it
    var wrapper = new Object();
    wrapper.Rows = docs;
    callback(wrapper);

  });
};

mongoose.connection.on('open', function () {
  console.log("mongodb connection open");

});

// init data
var seedUser = new UserObj();
seedUser.username = "David Neigler";
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
