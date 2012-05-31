/**
 * Module dependencies.
 */

var express = require('express')
  , url = require('url');

exports.boot = function (app) {
  bootApplication(app)
}

// App settings and middleware

function bootApplication(app) {
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

}
;
