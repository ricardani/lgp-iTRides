var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkLocation = new Schema({
  district: String,
  municipality: String,
  street: String,
  info: String,
  name: String

});

var DefaultRide = new Schema({
  owner: {
    type: Schema.ObjectId,
    ref: 'accounts'
  },
  seats: Number,
  time_start: Date,
  ride_type: String,
  type_cost: String,
  cost: Number,
  name: String,
  startLocation: [WorkLocation],
  destination: [WorkLocation]

});

module.exports = mongoose.model('DefaultRide', DefaultRide);
/*
var small = new DefaultRideFunc({
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
    'location': [{
      'district': 'String',
      'municipality': 'String',
      'street': 'String',
      'info': 'String'}],
    'name': 'String'
  }],
  'destination': [{
    'location': [{
      'district': 'String',
      'municipality': 'String',
      'street': 'String',
      'info': 'String'}],
    'name': 'String'
  }]
});
small.save(function (err) {
  if (err) {
    return console.log(err);
  }
  // saved!
})*/
