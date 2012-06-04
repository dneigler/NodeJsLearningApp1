/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 6/1/12
 * Time: 10:16 PM
 * To change this template use File | Settings | File Templates.
 */
var config_file = require('yaml-config');
var fs = require('fs');
exports = module.exports = config = config_file.readConfig('config/config.yaml');

require('./../db-connect');

// Bootstrap models
var models_path = __dirname + '/../models';
var model_files = fs.readdirSync(models_path);
model_files.forEach(function (file) {
  if (file == 'User.js')
    User = require(models_path + '/' + file);
  else
    require(models_path + '/' + file);
});

var audit = require('./../lib/audit-utils');

module.exports = {
  setUp:function (callback) {
    console.log('setup test');
  },
  tearDown:function (callback) {
    //mongoose.connection.close();
  },

  auditAll:function (test) {
    test.expect(3);

    audit.clearAudit(function (err) {
      console.log("ERR: " + err);
      audit.getAll(function (results) {

        test.ok(results, "results should be an object");
        test.ok(results.Rows, "results.Rows should be an array");
        console.log(results);
        test.ok(results.Rows.length == 0, "results.Rows.length should be == 0");
        test.done();
      });
    });

  },

  // TODO: figure out this strange issue where the second unit test freezes (likely hangs on async call to getAll or something)
  emptyAuditTrail:function (test) {
    test.expect(2);

    //audit.insertAuditTrail("TESTACTION", "TESTAUDITUSER", "TESTTARGETOBJECT", function (atErr) {
    //console.log("ATERR: " + atErr);
    audit.clearAudit(function (err) {
      console.log("ERR: " + err);
      test.ok(true, 'true');
      console.log("test was ok");
      audit.insertAuditTrail("TESTACTION", "TESTAUDITUSER", "TESTTARGETOBJECT", function (atErr) {
        console.log('inserted');
        audit.getAll(function (results) {
          test.ok(results.Rows.length == 1, "results.Rows.length should be == 0 but was " + results.Rows.length);
          test.done();

        });
      });
    });
    //});

  }
}
