var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Passenger = new Schema({
  _user: {
    type: Schema.ObjectId,
    ref: 'accounts'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

var Feedback = new Schema({
  _user: {
    type: Schema.ObjectId,
    ref: 'accounts'
  },
  feedback: Number,
  message: String
});

var DefaultRide = new Schema({
  _owner: {
    type: Schema.ObjectId,
    ref: 'accounts'
  },
  passengers: [Passenger],
  feedback:[Feedback],
  _defaultRideInfo: {
    type: Schema.ObjectId,
    ref: 'defaultrideinfos'
  }

});

module.exports = mongoose.model('DefaultRide', DefaultRide);
