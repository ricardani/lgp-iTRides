var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkLocation = new Schema({
  location: {
    district: String,
    municipality: String,
    street: String,
    info: String
  },
  name: String

});

module.exports = mongoose.model('WorkLocation', WorkLocation);
