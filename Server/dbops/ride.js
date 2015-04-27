var OccasionalRide = require('../models/occasionalRide');
var HomeToWorkRide = require('../models/homeToWorkRide');
var WorkToHomeRide = require('../models/workToHomeRide');
var WorkLocation = require('../models/workLocation');
var Account = require('../models/account');

function WorkLocationCreation(req, res) {

  var WorkLocation = new WorkLocation(req.body);
  WorkLocation.save(function(error, data) {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      res.json(data);
    }
  });

}
module.exports.createWorkLocation = WorkLocationCreation;

function occasionalRideCreation(req, res) {

  Account.findOne({
    "email": req.body.owner_email
  })
  .populate('_id')
  .exec( function(err,owner) {
    if(err) {
      res.json(err);
    }
    else {
      var occasionalRide = new OccasionalRide(req.body);
      occasionalRide._owner = owner;

      occasionalRide.save(function(error, data) {
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

module.exports.createOccasionalRide = occasionalRideCreation;


function defaultRideCreation(req, res) {

  if(req.body.startLocation) {
  /*  Account.findOne({
      "email": req.body.owner_email
    })
    .populate('_id')
    .exec( function(err,owner) {
      if(err) {
        res.json(err);
      }
      else {
*/
        WorkLocation.findOne({
          "name": req.body.locationName
        })
        .populate('_id')
        .exec(function(error, rideInfo) {

          var defaultRide = new HomeToWorkRide(req.body);
          /*TODO alterar para ler o id do owner
          defaultRide._owner = owner; */
          defaultRide._owner = null;
          defaultRide._workLocation = rideInfo;
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
/*    }
    }); */
  }
  else if(req.body.destination) {
    /*Account.findOne({
      "email": req.body.owner_email
    })
    .populate('_id')
    .exec( function(err,owner) {
      if(err) {
        res.json(err);
      }
      else {
        */
        WorkLocation.findOne({
          "name": req.body.locationName
        })
        .populate('_id')
        .exec(function(error, rideInfo) {

          var defaultRide = new WorkToHomeRide(req.body);
          /*TODO alterar para ler o id do owner
          defaultRide._owner = owner; */
          defaultRide._owner = null;
          defaultRide._workLocation = rideInfo;
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
  /*    }
    });*/
  }
  else
    res.json("Failed to identify if it is a work to home or home to work ride");

}

module.exports.createDefaultRide = defaultRideCreation;

/* TODO update to the new HomeToWork WorkToHome WorkLocation OccasionalRide sintax*/
function removeRide(req, res) {

  if(req.body.startLocation.district) {

    WorkLocation.findOne({
      "name": req.body.rideName
    })
    .populate('_id')
    .exec(function(err, rideInfo) {
      HomeToWorkRide.findOne({
          "_owner": req.user.id,
          "_workLocation": rideInfo
        }).remove(function(error, data) {
          if (error) {
            res.json(error);
          } else
            res.json(data);
        });
    });

  }
  else if(req.body.destination.district) {
    WorkLocation.findOne({
      "name": req.body.rideName
    })
    .populate('_id')
    .exec(function(err, rideInfo) {
      WorkToHomeRide.findOne({
          "_owner": req.user.id,
          "_workLocation": rideInfo
        }).remove(function(error, data) {
          if (error) {
            res.json(error);
          } else
            res.json(data);
        });
    });
  }
  else if(req.body.destination.address) {

    OccasionalRide.findOne({
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
    WorkLocation.findOne({
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
                "_workLocation": rideInfo
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
        OccasionalRide.findOne({
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

function getWorkLocations(req, res) {

    WorkLocation.find({}, function(err,workLocations) {
      if(err) {
        res.json("Couldn't find any work locations");
      }
      else {
        res.json(workLocations);
      }
    });

}

module.exports.workLocations = getWorkLocations;
