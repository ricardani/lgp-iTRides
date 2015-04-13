var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
  message: String,
  sender: String,
  type: String
});

var Account = new Schema({
  name: String,
  email: String,
  password: String,
  contact: String,
  photo: String,
  activated: {
    type: Boolean,
    default: false
  },
  notifications: [Notification]

});

mongoose.model('Account', Account);
