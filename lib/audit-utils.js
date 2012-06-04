/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 5/30/12
 * Time: 10:35 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');
var AuditObj = mongoose.model('audit');
var ioLocal;

/*
 module.exports = function (app, io) {
 ioLocal = io;
 */

exports.clearAudit = function (callback) {
  // Clear audits for now
  AuditObj.remove({}, function (err) {
    if (typeof callback == 'function')
      callback(err);
  });
}

exports.setIo = function (io) {
  ioLocal = io;
};

exports.getAll = function (callback) {
  var query = AuditObj.find({});
  query.exec(function (err, docs) {
    console.log('Sending back: ' + docs);
    // try wrapping it
    var wrapper = new Object();
    wrapper.Rows = docs;
    callback(wrapper);
    //return;
  });
};

exports.insertAuditTrail = function (action, audituser, targetobject, callback) {
  var audit = new AuditObj();
  audit.action = action;
  audit.audituser = audituser;
  audit.targetobject = targetobject;
  audit.save(function (err) {
    if (err) {
      console.log('error saving audit: ' + err);
    } else {
      if (ioLocal)
        ioLocal.sockets.emit('auditTrail', audit);
      console.log('audit saved: ' + audit);
    }
    callback(err);
  });

};
// }


