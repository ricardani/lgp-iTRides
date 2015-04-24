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

var WorkToHomeRide = new Schema({
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
  destination: {
    district: String,
    municipality: String,
    street: String,
    info: String
  },
  _workLocation: {
    type: Schema.ObjectId,
    ref: 'worklocations'
  }

});

module.exports = mongoose.model('WorkToHomeRide', WorkToHomeRide);
