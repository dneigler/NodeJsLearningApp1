/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 6/5/12
 * Time: 10:48 PM
 * To change this template use File | Settings | File Templates.
 */
// node samples/sample.js
var csv = require('csv');
var repos = require('./../repos');
var mongoose = require('mongoose');
var ResourceAllocationObj = mongoose.model('ResourceAllocation');
var ioLocal;

exports.importCsv = function (fromPath, callback) {
  csv()
    .fromPath(fromPath, {
    columns: true
    })
    /*.toStream(process.stdout)*/
    /*.transform(function(data){
      data.unshift(data.pop());
      return data;
    })*/
    .on('data',function(data,index){
      console.log('#'+index+' '+JSON.stringify(data));
      var alloc = new ResourceAllocationObj(data);
      alloc.save(function (err) {
        if (err) {
          console.log('error saving audit: ' + err);
        } else {
          if (ioLocal)
            ioLocal.sockets.emit('auditTrail', alloc);
          console.log('audit saved: ' + alloc);
        }
        callback(err);
      });
    })
    .on('end',function(count){
      console.log('Number of lines: '+count);
    })
    .on('error',function(error){
      console.log(error.message);
    });

  // Print sth like:
  // #0 ["2000-01-01","20322051544","1979.0","8.8017226E7","ABC","45"]
  // #1 ["2050-11-27","28392898392","1974.0","8.8392926E7","DEF","23"]
  // Number of lines: 2
}

exports.setIo = function (io) {
  ioLocal = io;
};

