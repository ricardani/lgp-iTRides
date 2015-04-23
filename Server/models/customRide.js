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
  state: String,
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
/*
var small = new CustomRideFunc({
  'seats': 3,
  'ride_type': 'String',
  'type_cost': 'String',
  'cost': 4.5,
  'passagers': [{
    'user_email': 'String'
  }],
  'feedback': [{
    'user_email': 'String',
    'feedback': 3,
    'message': 'String'
  }],
  'state': 'String',
  'startLocation': [{
    'district': 'String',
    'municipality': 'String',
    'street': 'String',
    'info': 'String'
  }],
  'destination': [{
    'district': 'String',
    'municipality': 'String',
    'street': 'String',
    'info': 'String'
  }]
});
small.save(function (err) {
  if (err) {
    return console.log(err);
  }
  // saved!
})*/
