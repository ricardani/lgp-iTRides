var OccasionalRide = require('../models/occasionalRide');
var HomeAndWorkRide = require('../models/homeAndWorkRide');
var WorkLocation = require('../models/workLocation');
var Account = require('../models/account');
var Ride = require('../models/ride').rideModel;
var RideInfo = require('../models/rideInfo');
var async = require('async');

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
            res.json(err);
          }
          else {
            WorkLocation.findOne({
                "name": req.body.locationName
            })
            .populate('_id')
            .exec(function(error, workLocation) {
                if(error) {
                  res.json(error);
                }
                else {
                  var defaultRide = new HomeAndWorkRide(req.body);
                  defaultRide._owner = owner;
                  defaultRide._workLocation = workLocation;
                  defaultRide.save(function(error, data) {
                      if (error) {
                          res.json(error);
                      } else {
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

/* TODO update to the new HomeAndWorkRide WorkLocation OccasionalRide sintax*/

function removeRide(req, res) {

    if(req.body.ride_type == "CT" || req.body.ride_type == "TC") {
        WorkLocation.findOne({
            "name": req.body.rideName
        })
            .populate('_id')
            .exec(function(err, rideInfo) {
                HomeAndWorkRide.findOne({
                    "_owner": req.user.id,
                    "_workLocation": rideInfo,
                    "homeLocation": req.body.homeLocation
                }).remove(function(error, data) {
                    if (error) {
                        res.json(error);
                    } else
                        res.json(data);
                });
            });
    }
    else if(req.body.ride_type == "Ocasional") {

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
    else
      res.json('Couldn`t determine the ride type');

}

module.exports.deleteRide = removeRide;


function rideInfoCreation(req,res) {

  Account.findOne({
      "_id": req.user.id
  })
  .populate('_id')
  .exec( function(err,owner) {
      if(err) {
        res.json(err);
      }
      else {
        WorkLocation.findOne({
            "name": req.body.workLocationName
        })
        .populate('_id')
        .exec(function(error, workLocation) {
            if(error) {
              res.json(error);
            }
            else {
              var rideInfo = new RideInfo(req.body);
              rideInfo._owner = owner;
              rideInfo._workLocation = workLocation;
              rideInfo.save(function(error, data) {
                  if (error) {
                      res.json(error);
                  } else {
                      res.json(data);
                  }
              });
            }
        });
      }
  });
}

module.exports.createRideInfo = rideInfoCreation;

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
          Ride.findOne({
            "ride_type": req.body.ride_type,
            "homeLocation": req.body.homeLocation,
            "_workLocation": workLocation._id,
            "_owner": rideOwner._id
          }, function(err, data) {
            if(err) {
              res.json(err);
            }
            else {
              data.passengers.push({"_user":req.user.id});
              data.save(function(error, addedPassenger) {
                  if (error) {
                      res.json(error);
                  } else {
                      res.json(addedPassenger);
                  }
              });
            }
        });
      }

    });

}

module.exports.requestsRide = requestRide;


function requestRideDeletion(req,res) {

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

            Ride.findOneAndUpdate({
              "ride_type": req.body.ride_type,
              "homeLocation": req.body.homeLocation,
              "_workLocation": workLocation._id,
              "_owner": rideOwner._id
            },
            {$pull:{passengers: {_user: req.user.id}}},
            function(err, data) {
              if(err) {
                res.json(err);
              }
              else {
                res.json(data);
              }
            });
          }
        });
      }
      else if(req.body.ride_type == 'Ocasional') {
        Ride.update({
          "ride_type": req.body.ride_type,
          "startLocation": req.body.startLocation,
          "destination": req.body.destination,
          "_owner": rideOwner
        },
        { $pull: { passengers : {_user:req.user.id}}},
        false,
        function(err, data) {
          if(err) {
            res.json(err);
          }
          else
            res.json(data);
        }
        );
      }
    }
  });

}

module.exports.deleteRequestedRide = requestRideDeletion;


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


function getWorkLocation(req,res) {
  WorkLocation.findOne({
    "_id": req.body._workLocation
  },function(err,data) {
    if(err) {
      res.json(err);
    }
    else {
      res.json(data);
    }
  });
}

module.exports.oneWorkLocation = getWorkLocation;


function getMyRides(req, res) {

    Ride.find({
        $and: [
            { '_owner': req.user.id },
            { state: 'active' },
            { time_start: { $gte: Date.now() } }
        ]
    }, function(err, data) {
        if (err || data === null) {
            console.log(err);
            res.json(err);
        }else{
            var myRides = [];

            async.each(data, function(ride, callback) {
                var RideInfo = {
                    id : ride._id,
                    date : ride.time_start,
                    typeCost : ride.typeCost,
                    cost : ride.cost,
                    seats : ride.seats,
                    startLocation : '',
                    destination : ''
                };

                var wLocation = ride._workLocation;
                var rideType = ride.ride_type;

                if(rideType === 'CT'){
                    RideInfo.startLocation = ride.homeLocation.street + ', ' + ride.homeLocation.municipality + ', ' + ride.homeLocation.district;
                }else if(rideType === 'TC'){
                    RideInfo.destination = ride.homeLocation.street + ', ' + ride.homeLocation.municipality + ', ' + ride.homeLocation.district;
                }else if(rideType === 'Ocasional'){
                    RideInfo.startLocation = ride.startLocation.identifier;
                    RideInfo.destination = ride.destination.identifier;
                }

                if (rideType != 'Ocasional') {

                    WorkLocation.findOne({
                        '_id': wLocation
                    }, function (err, data) {
                        if (err || data === null) {
                            callback('error');
                            console.log(err);
                        } else {
                            if (rideType === 'TC') {
                                RideInfo.startLocation = data.name;
                            } else {
                                RideInfo.destination = data.name;
                            }
                            myRides.push(RideInfo);
                            callback();
                        }
                    });

                }else{
                    myRides.push(RideInfo);
                    callback();
                }

            }, function(err){
                if( err ) {
                    console.log('GetMyRides error -> ' + err);
                } else {
                    res.json(myRides);
                }
            });
        }
    });

}

module.exports.myRides = getMyRides;


function getMyRequestedRides(req, res) {

    Ride.find({
        $and: [
            { passengers: {
                $elemMatch: {
                    _user: req.user.id
                }
            }},
            { state: 'active' },
            { time_start: { $gte: Date.now() } }
        ]
    }, function(err, data) {
        if (err || data === null) {
            console.log(err);
            res.json(err);
        } else {

            var myRequestedRides = [];

            async.each(data, function(ride, callback) {
                var RideInfo = {
                    id : ride._id,
                    date : ride.time_start,
                    startLocation : '',
                    destination : '',
                    ownerName : '',
                    ownerPhoto : ''
                };

                var wLocation = ride._workLocation;
                var rideType = ride.ride_type;
                var ownerID = ride._owner;

                if(rideType === 'CT'){
                    RideInfo.startLocation = ride.homeLocation.street + ', ' + ride.homeLocation.municipality + ', ' + ride.homeLocation.district;
                }else if(rideType === 'TC'){
                    RideInfo.destination = ride.homeLocation.street + ', ' + ride.homeLocation.municipality + ', ' + ride.homeLocation.district;
                }else if(rideType === 'Ocasional'){
                    RideInfo.startLocation = ride.startLocation.identifier;
                    RideInfo.destination = ride.destination.identifier;
                }

                Account.findOne({
                    '_id': ownerID
                }, function(err, data) {
                    if (err || data === null) {
                        console.log(err);
                        callback('error');
                    } else {
                        RideInfo.ownerName = data.name;
                        RideInfo.ownerPhoto = data.photo;

                        if (rideType != 'Ocasional') {

                            WorkLocation.findOne({
                                '_id': wLocation
                            }, function (err, data) {
                                if (err || data === null) {
                                    console.log(err);
                                    callback('error');
                                } else {
                                    if (rideType === 'TC') {
                                        RideInfo.startLocation = data.name;
                                    } else {
                                        RideInfo.destination = data.name;
                                    }
                                    myRequestedRides.push(RideInfo);
                                    callback();
                                }
                            });

                        }else{
                            myRequestedRides.push(RideInfo);
                            callback();
                        }
                    }});

            }, function(err){
                if( err ) {
                    console.log('Get My Requested Rides error -> ' + err);
                } else {
                    res.json(myRequestedRides);
                }
            });
        }
    });

}

module.exports.myRequestedRides = getMyRequestedRides;


function getRide(req, res) {

    Ride.findOne({
        $and: [
            { '_id': req.query.rideID }/*,
             { state: 'active' },
             { time_start: { $gte: Date.now() } }*/
        ]
    }, function(err, data) {
        if (err || data === null) {
            res.json(err);
        } else {
            var RideInfo = {
                id : data._id,
                date : data.time_start,
                passengers : [],
                typeCost : data.typeCost,
                cost : data.cost,
                seats : data.seats,
                startLocation : '',
                destination : '',
                ownerName : '',
                ownerPhoto : '',
                myStatus : ''
            };

            var wLocation = [data._workLocation];
            var rideType = data.ride_type;
            var ownerID = data._owner;
            var passengersID = [];

            if(rideType === 'CT'){
                RideInfo.startLocation = data.homeLocation.street + ', ' + data.homeLocation.municipality + ', ' + data.homeLocation.district;
            }else if(rideType === 'TC'){
                RideInfo.destination = data.homeLocation.street + ', ' + data.homeLocation.municipality + ', ' + data.homeLocation.district;
            }else if(rideType === 'Ocasional'){
                RideInfo.startLocation = data.startLocation.identifier;
                RideInfo.destination = data.destination.identifier;
            }

            async.eachSeries(data.passengers, function(p, callback) {
                var passenger = JSON.parse(JSON.stringify(p));
                var userID = passenger._user;
                var registerDate = passenger.date;

                Account.findOne({
                    '_id': userID
                }, function(err, data) {
                    if (err || data === null) {
                        callback('error');
                    }else{
                        var user = {
                            name : data.name,
                            photo : data.photo,
                            date : registerDate
                        };

                        passengersID.push(JSON.stringify(data._id));
                        RideInfo.passengers.push(user);
                        callback();
                    }
                });

            }, function(err){
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                    // One of the iterations produced an error.
                    // All processing will now stop.
                    res.json(err);
                } else {

                    var myID = JSON.stringify(req.user.id);

                    if(passengersID.indexOf(myID) > -1) {
                        RideInfo.myStatus = 'myRequest';
                    }else if(JSON.stringify(ownerID) === myID){
                        RideInfo.myStatus = 'myRide';
                    }else{
                        RideInfo.myStatus = 'other';
                    }

                    Account.findOne({
                        '_id': ownerID
                    }, function(err, data) {
                        if (err || data === null) {
                            res.json(err);
                        } else {
                            RideInfo.ownerName = data.name;
                            RideInfo.ownerPhoto = data.photo;

                            if (rideType != 'Ocasional') {

                                WorkLocation.findOne({
                                    '_id': wLocation
                                }, function (err, data) {
                                    if (err || data === null) {
                                        callback('error');
                                    } else {
                                        if (rideType === 'TC') {
                                            RideInfo.startLocation = data.name;
                                        } else {
                                            RideInfo.destination = data.name;
                                        }
                                        res.json(RideInfo);
                                    }
                                });

                            }else{
                                res.json(RideInfo);
                            }
                        }});
                }
            });
        }});
}

module.exports.oneRide = getRide;

function getMyDefaultRides(req, res) {

    RideInfo.find({
        '_owner': req.user.id
    }, function(err,data) {
        if(err) {
            console.log("Error GetMyDefaultRides -> " + err);
            res.json(err);
        }
        else {

            var allRides = [];

            async.each(data, function(ride, callback) {
                var rideInfo = {
                    id : ride.id,
                    seats : ride.seats,
                    date : ride.time_start,
                    type_cost : ride.type_cost,
                    cost : ride.cost,
                    name : ride.name,
                    ride_type : ride.ride_type
                };

                allRides.push(rideInfo);
                callback();

            }, function(err){
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                    console.log("Error GetMyDefaultRides -> " + err);
                    res.json(err);
                } else {
                    res.json(allRides);
                }
            });

        }
    });


}

module.exports.myDefaultRides = getMyDefaultRides;

function UserRideInfos(req,res) {

  var error ="";
  var rideInfo = {};

  RideInfo.find({
    "_owner":req.user.id
  },function(err,data) {
    if(err) {
      res.json(err);
    }
    else {
      res.json(data);
    }
  });
}

module.exports.getRideInfos = UserRideInfos;
