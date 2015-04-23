var CustomRide = require('../models/customRide');
var DefaultRide = require('../models/defaultRide');
var DefaultRideInfo = require('../models/defaultRideInfo');
var Account = require('../models/account');

function defaultRideInfoCreation(req, res) {

  var defaultRideInfo = new DefaultRideInfo(req.body);
  defaultRideInfo.save(function(error, data) {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      res.json(data);
    }
  });

}
module.exports.createDefaultRideInfo = defaultRideInfoCreation;


function customRideCreation(req, res) {

  Account.findOne({
    "email": req.body.owner_email
  })
  .populate('_id')
  .exec( function(err,owner) {
    if(err) {
      res.json(err);
    }
    else {
      var customRide = new CustomRide(req.body);
      customRide._owner = owner;

      customRide.save(function(error, data) {
        if (error) {
          console.log(error);
          res.json(error);
        } else {
          res.json(data);
        }
      });
    }
  });

}

module.exports.createCustomRide = customRideCreation;


function defaultRideCreation(req, res) {

  Account.findOne({
    "email": req.body.owner_email
  })
  .populate('_id')
  .exec( function(err,owner) {
    if(err) {
      res.json(err);
    }
    else {

      DefaultRideInfo.findOne({
        "name": req.body.rideName
      })
      .populate('_id')
      .exec(function(error, rideInfo) {

        var defaultRide = new DefaultRide(req.body);
        defaultRide._owner = owner;
        defaultRide._defaultRideInfo = rideInfo;
        defaultRide.save(function(error, data) {
          if (error) {
            console.log(error);
            res.json(error);
          } else {
            console.log(data);
            res.json(data);
          }
        });
      });
    }
  });

}

module.exports.createDefaultRide = defaultRideCreation;


function removeRide(req, res) {

  if(req.body.ride_type == 'default') {

    DefaultRideInfo.findOne({
      "name": req.body.rideName
    })
    .populate('_id')
    .exec(function(err, rideInfo) {
      DefaultRide.findOne({
          "_owner": req.user.id,
          "_defaultRideInfo": rideInfo
        }).remove(function(error, data) {
          if (error) {
            res.json(error);
          } else
            res.json(data);
        });
    });

  }
  else if(req.body.ride_type == 'custom') {
    CustomRide.findOne({
        "_owner": req.user.id,
        "time_start": req.body.time_start,
        "startLocation": req.body.startLocation,
        "destination": req.body.destination
      }).remove(function(error, data) {
        if (error) {
          res.json(error);
        } else
          res.json(data);
      });
  }

}

module.exports.deleteRide = removeRide;

function requestRide(req, res) {

  if(req.body.ride_type == 'default') {
    DefaultRideInfo.findOne({
        "name": req.body.rideName
      })
      .populate('_id')
      .exec( function(error, rideInfo) {
        if(error) {
          res.json("Couldn't find the ride info");
        }
        else {
          Account.findOne({
            "email": req.body.owner_email
          })
          .populate('_id')
          .exec( function(err, owner) {
            if(err) {
              res.json("Couldn't find the owner");
            }
            else {
              DefaultRide.findOne({
                "_owner": owner,
                "_defaultRideInfo": rideInfo
              }, function(erro, ride) {

                if(erro) {
                  res.json("Couldn't find the ride");
                }
                else {
                  ride.passengers.push({"_user": req.user.id});
                  res.json(ride);
                }
              });
            }
          });
        }
      });
  }
  else if(req.body.ride_type == 'custom') {

    Account.findOne({
      "email": req.body.owner_email
    })
    .populate('_id')
    .exec( function(err, owner) {
      if(err) {
        res.json("Couldn't find the owner");
      }
      else {
        CustomRide.findOne({
          "_owner": owner
        }, function(erro, ride) {

          if(erro) {
            res.json("Couldn't find the ride");
          }
          else {
            ride.passengers.push({"_user": req.user.id});
            res.json(ride);
          }
        });
      }
    });
  }
}

module.exports.requestsRide = requestRide;
