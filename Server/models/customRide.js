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

var CustomRide = new Schema({
  _owner: {
    type: Schema.ObjectId,
    ref: 'accounts'
  },
  seats: Number,
  time_start: String,
  ride_type: String,
  type_cost: String,
  cost: Number,
  passengers: [Passenger],
  feedback:[Feedback],
  date: Date,
  state: {
    type: String,
    default: "waiting"
  },
  startLocation: {
    district: String,
    municipality: String,
    street: String,
    info: String
  },
  destination: {
    district: String,
    municipality: String,
    street: String,
    info: String
  }
});

module.exports = mongoose.model('CustomRide', CustomRide);
