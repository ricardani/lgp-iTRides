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

var OccasionalRide = new Schema({
  _owner: {
    type: Schema.ObjectId,
    ref: 'accounts'
  },
  seats: Number,
  time_start: String,
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
    address: String,
    identifier: String
  },
  destination: {
    address: String,
    identifier: String
  }
});

module.exports = mongoose.model('OccasionalRide', OccasionalRide);
