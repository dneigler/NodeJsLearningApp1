var routes = require('../routes'),
  repos = require('../repos'),
  audit = require('./../lib/audit-utils'),
  csv = require('./../lib/csv-utils'),
  statusData = require('./../public/javascripts/ProjectStatus-2012-07'),
  ioLocal;

module.exports = function (app, io) {
  ioLocal = io;

  app.get('/status', function (req, res) {
    res.render('status', { title: 'Status Report', author:'Dave Neigler'});
  });

  app.get('/status/get', function(req,res) {
  	// pass in a date param
  	// for now dummy vaal
  	var statusDate = '2/1/2011';

  	repos.getProjectStatusItems(statusDate, function(err, docs) {
  		if (err)
  			console.log(JSON.stringify(err));
  		else {
	  		res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(docs));
		}
  	});
  });

  app.get('/status/get/:statusDate', function(req,res) {
  	// sample URL: http://localhost:3000/status/get/01%2F01%2F2012
  	// pass in a date param
  	// for now dummy vaal
  	var statusDate = req.params.statusDate;
  	console.log('retrieving for ' + statusDate);

  	repos.getProjectStatusItems(statusDate, function(err, docs) {
  		if (err)
  			console.log(JSON.stringify(err));
  		else {
	  		res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(docs));
		}
  	});
  });

  app.get('/statusimport', function (req, res) {
  	res.render('statusimport', {title: 'Status Importer'});
  });

  app.post('/statusimport', function (req, res) {
  	// 
  	var data = statusData.getProjectStatusData();
  	repos.saveProjectStatusItems(data, function() {
  		console.log('done with saveProjectStatusItems');
  		res.write('FINISH STATUS IMPORT');
  		res.end();
  	});
  });
};