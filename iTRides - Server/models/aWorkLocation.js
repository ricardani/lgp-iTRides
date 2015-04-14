var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkLocation = new Schema({
  district: String,
  municipality: String,
  street: String,
  info: String,
  name: String

});

mongoose.model('WorkLocation', WorkLocation);
