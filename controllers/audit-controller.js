/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 5/30/12
 * Time: 10:35 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');
var AuditObj = mongoose.model('audit');

module.exports = function (app, io) {
  // var AuditObj = mongoose.model('audit', AuditSchema);
  // Clear audits for now
  AuditObj.remove({}, function () {
  });


  exports.insertAuditTrail = function (action, audituser, targetobject) {
    var audit = new AuditObj();
    audit.action = action;
    audit.audituser = audituser;
    audit.targetobject = targetobject;
    audit.save(function (err) {
      if (err) {
        console.log('error saving audit: ' + err);
      } else {
        console.log('audit saved: ' + audit);
      }
    });
    io.sockets.emit('auditTrail', audit);
  };
}