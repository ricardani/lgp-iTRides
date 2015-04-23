var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DefaultRide = new Schema({
  _owner: {
    type: Schema.ObjectId,
    ref: 'accounts'
  },
  seats: Number,
  time_start: String,
  ride_type: String,
  type_cost: String,
  cost: Number,
  name: String,
  _startLocation: {
    type: Schema.ObjectId,
    ref: 'worklocations'
  },
  _destination: {
    type: Schema.ObjectId,
    ref: 'worklocations'
  }

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
