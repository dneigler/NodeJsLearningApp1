var repos = require('../repos');
/*
 * GET home page.
 */

exports.index = function (req, res) {
  repos.getUsers(req, res);
  // res.render('index', { title: 'Resource Manager', author: 'Dave Neigler' });
};