var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
  _sender: {
    type: Schema.ObjectId,
    ref:'accounts'
  },
  type: String,
  _ride: {
    type: Schema.ObjectId,
    ref:'rides'
  },
  rideType: String,
  rideTime: String
});

var Account = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  contact: String,
  residency: String,
  photo: {
    type: String,
    default: "img/default_profile_photo.png"
  },
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
