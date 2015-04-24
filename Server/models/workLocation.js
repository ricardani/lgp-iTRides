var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkLocation = new Schema({

  name: String,
  defaultLocation: {
    district: String,
    municipality: String,
    street: String,
    info: String
  }

});

module.exports = mongoose.model('WorkLocation', WorkLocation);
