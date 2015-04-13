var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Passager = new Schema({
  user_email: String,
  date: Date
});

var Feedback = new Schema({
  user_email: String,
  feedback: Number,
  message: String
});

var Location = new Schema({
  district: String,
  municipality: String,
  street: String,
  info: String

});

var CustomRide = new Schema({
  seats: Number,
  time_start: Date,
  ride_type: String,
  type_cost: String,
  cost: Number,
  passagers: [Passager],
  feedback:[Feedback],
  date: Date,
  state: String

});

mongoose.model('CustomRide', CustomRide);
