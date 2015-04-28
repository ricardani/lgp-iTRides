var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RideSchema = require('../models/ride').rideSchema;

var HomeAndWorkRide = RideSchema.extend({

  homeLocation: {
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

module.exports = mongoose.model('HomeAndWorkRide',HomeAndWorkRide);
