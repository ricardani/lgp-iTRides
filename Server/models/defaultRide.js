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
  defaultRideInfo: {
    type: Schema.ObjectId,
    ref: 'defaultrideinfos'
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
