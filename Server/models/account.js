var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
  _sender: {
    type: Schema.ObjectId,
    ref:'accounts'
  },
  type: String,
  _customRideId: {
    type: Schema.ObjectId,
    ref:'customrides'
  }
});

var Account = new Schema({
  name: String,
  email: String,
  password: String,
  contact: String,
  residency: String,
  photo: String,
  activated: {
    type: Boolean,
    default: false
  },
  notifications: [Notification],
  permission: {
    type: String,
    default: 'User'
  },
  penalties: {
	type: Number,
	default: 0
  }

});

module.exports = mongoose.model('Account', Account);
