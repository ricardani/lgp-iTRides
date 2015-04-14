var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkLocation = mongoose.model('WorkLocation').schema;

var Passager = new Schema({
  user_email: String,
  date: Date
});

var Feedback = new Schema({
  user_email: String,
  feedback: Number,
  message: String
});

var DefaultRide = new Schema({
  seats: Number,
  time_start: Date,
  ride_type: String,
  type_cost: String,
  cost: Number,
  passagers: [Passager],
  feedback: [Feedback],
  name: String,
  startLocation: [WorkLocation],
  destination: [WorkLocation]

});

mongoose.model('DefaultRide', DefaultRide);
