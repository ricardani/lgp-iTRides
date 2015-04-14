var CustomRide = require('../models/customRide');
var DefaultRide = require('../models/defaultRide');

function customRideCreation(req, res) {
  var customRide = new CustomRide(req.body);
  customRide.startLocation.push(req.body.startLocation);
  customRide.destination.push(req.body.destination);

  customRide.save(function(error, data) {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      res.json(data);
    }
  });

}

module.exports.createCustomRide = customRideCreation;

function defaultRideCreation(req, res) {
  var defaultRide = new DefaultRide(req.body);
  defaultRide.startLocation.push(req.body.startLocation);
  defaultRide.destination.push(req.body.destination);

  defaultRide.save(function(error, data) {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      res.json(data);
    }
  });

}

module.exports.createDefaultRide = defaultRideCreation;
