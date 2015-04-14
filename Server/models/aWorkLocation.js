var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RideLocation = require('mongoose').model('RideLocation').schema;

var WorkLocation = new Schema({
  location: [RideLocation],
  name: String

});

module.exports = mongoose.model('WorkLocation', WorkLocation);
/*
var small = new WorkLocationFunc({
  'location': [{
    'district': 'String',
    'municipality': 'String',
    'street': 'String',
    'info': 'String'}],
  'name': 'String'
});
small.save(function (err) {
  if (err) {
    return console.log(err);
  }
  // saved!
})*/
