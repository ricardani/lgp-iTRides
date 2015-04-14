var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RideLocation = new Schema({
  district: String,
  municipality: String,
  street: String,
  info: String

});

module.exports = mongoose.model('RideLocation', RideLocation);
/*
var small = new RideLocationFunc({
  'district': 'String',
  'municipality': 'String',
  'street': 'String',
  'info': 'String'
});
small.save(function (err) {
  if (err) {
    return console.log(err);
  }
  // saved!
})*/
