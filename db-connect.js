exports = mongoose = require('mongoose')
console.log('connecting to ' + config.db.uri);
mongoose.connect(config.db.uri)
exports = Schema = mongoose.Schema
