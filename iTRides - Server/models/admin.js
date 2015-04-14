var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Admin = new Schema({
  name: String,
  email: String,
  password: String,
  contact: String,
  photo: String,
  activated: {
    type: Boolean,
    default: false
  }

});

mongoose.model('Admin', Admin);
