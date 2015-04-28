var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
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

var RideSchema = new Schema({
  _owner: {
    type: Schema.ObjectId,
    ref: 'accounts'
  },
  seats: Number,
  time_start: Date,
  ride_type: String,
  cost: Number,
  state: {
    type: String,
    default: "active"
  },
  passengers: [Passenger],
  feedback:[Feedback]
}, {collection: 'rides', discriminatorKey : '_type'});


module.exports.rideSchema = RideSchema;
module.exports.rideModel = mongoose.model('Ride', RideSchema);
