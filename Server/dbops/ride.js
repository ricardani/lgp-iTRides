var OccasionalRide = require('../models/occasionalRide');
var HomeAndWorkRide = require('../models/homeAndWorkRide');
var WorkLocation = require('../models/workLocation');
var Account = require('../models/account');
var Ride = require('../models/ride').rideModel;

function WorkLocationCreation(req, res) {

    //TODO Verifica se existe um local de trabalho com o nome pedido contando o numero de locais de trabalho com esse nome
    WorkLocation.count({
      "name": req.body.name
    }, function(err,count) {
      if(count==0) {
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
      else
        res.json('Já existe um local de trabalho com esse nome');

    });
}
module.exports.createWorkLocations = WorkLocationCreation;


function WorkLocationDeletion(req, res) {
  WorkLocation.findOne({
    "name": req.body.workLocationName
  }).remove(function(error, data) {
      if (error) {
          res.json(error);
      } else
          res.json(data);
  });
}

module.exports.createWorkLocations = WorkLocationDeletion;


//TODO verificar senao esta a criar uma boleia igual a uma que ele proprio ja criou
function rideCreation(req, res) {

    if(req.body.ride_type == "Ocasional") {
        Account.findOne({
            "_id": req.user.id
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
    else if(req.body.ride_type == "TC" || req.body.ride_type == "CT") {
      Account.findOne({
          "_id": req.user.id
      })
      .populate('_id')
      .exec( function(err,owner) {
          if(err) {
            console.log(err);
            res.json(err);
          }
          else {
            WorkLocation.findOne({
                "name": req.body.locationName
            })
            .populate('_id')
            .exec(function(error, workLocation) {
                if(error) {
                  console.log(error);
                  res.json(error);
                }
                else {
                  var defaultRide = new HomeAndWorkRide(req.body);
                  defaultRide._owner = owner;
                  defaultRide._workLocation = workLocation;
                  defaultRide.save(function(error, data) {
                      if (error) {
                          console.log(error);
                          res.json(error);
                      } else {
                          console.log(data);
                          res.json(data);
                      }
                  });
                }
            });
          }
      });
    }
    else {
        res.json('Couldn`t determine the ride type');
    }
}

module.exports.createRide = rideCreation;

/* TODO update to the new HomeToWork WorkToHome WorkLocation OccasionalRide sintax*/

function removeRide(req, res) {

    if(req.body.startLocation.district) {

        WorkLocation.findOne({
            "name": req.body.rideName
        })
        .populate('_id')
        .exec(function(err, rideInfo) {
            HomeAndWorkRide.findOne({
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
                HomeAndWorkRide.findOne({
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

//TODO verificar o problema de haver 2 donos com o mesmo nome
function requestRide(req, res) {

    Account.findOne({
        "name": req.body.ownerName
    })
    .populate('_id')
    .exec( function(error, rideOwner) {
      if(error) {
          res.json("Couldn't find that work location");
      }
      else {
        if(req.body.ride_type == 'CT' || req.body.ride_type == 'TC') {
          WorkLocation.findOne({
              "name": req.body.workLocationName
          })
          .populate('_id')
          .exec( function(error, workLocation) {
            if(error) {
                res.json("Couldn't find that work location");
            }
            else {
              Ride.findOne({
                "ride_type": req.body.ride_type,
                "homeLocation": req.body.homeLocation,
                "_workLocation": workLocation,
                "_owner": rideOwner
              }, function(err, data) {
                if(err) {
                  res.json(err);
                }
                else {
                  data.passengers.push({"_user":req.user.id});
                }
              });
            }
          });
        }
        else if(req.body.ride_type == 'Ocasional') {
          Ride.findOne({
            "ride_type": req.body.ride_type,
            "startLocation": req.body.startLocation,
            "destination": req.body.destination,
            "_owner": rideOwner
          }, function(err, data) {
            if(err) {
              res.json(err);
            }
            else {
              data.passengers.push({"_user":req.user.id});
            }
          });
        }
      }
    });

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


function getRide(req, res) {

    Ride.findOne({
        '_id': req.query.rideID
    }, function(err, data) {
        if (err || data === null) {
            console.log(err);
            res.json(err);
        } else {
            res.json(data);
        }});

}

module.exports.oneRide = getRide;
