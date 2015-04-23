var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DefaultRideInfo = new Schema({

  seats: Number,
  time_start: String,
  ride_type: String,
  type_cost: String,
  cost: Number,
  name: String,
  defaultLocation: {
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
  }

});

module.exports = mongoose.model('DefaultRideInfo', DefaultRideInfo);
