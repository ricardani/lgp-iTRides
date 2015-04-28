var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RideSchema = require('../models/ride').rideSchema;

var OccasionalRide = RideSchema.extend({

  type_cost: String,
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
