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

function allRides(req, res) {

    Ride.find({}, function(error, rides) {
        if (error) {
            res.json(error);
        }
        else {
            res.json(rides);
        }
    });
}

module.exports.getallRides = allRides;

function removeRide(req, res) {

  Ride.findOneAndRemove({
    "_id": req.body.rideID
  }, function(error,ride) {
    if (error) {
      res.json(error);
    } else {
      for(var i =0; i < ride.passengers.length; i++) {
        Account.findOne({
          "_id": ride.passengers[i]._user
        }, function(err,passenger) {
          if(err) {

          }
          else {

            var notification = {
              _sender: ride._owner,
              type: "Cancel",
              _ride: req.body.rideID,
              rideType: ride.ride_type,
              rideTime: ride.time_start
            }
            passenger.notifications.push(notification);
            passenger.save(function(error, addedNotification) {
                if (error) {
                } else {
                }
            });
          }
        });
      }
      res.json(ride);
    }
  });
}

module.exports.deleteRide = removeRide;


function removeDefaultRide(req,res) {
  RideInfo.findOneAndRemove({
    "_id": req.body.rideID
  }, function(error,ride) {
    if (error) {
      res.json(error);
    } else {
      res.json(ride);
    }
  });
}

module.exports.deleteDefaultRide = removeDefaultRide;


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

function requestRide(req, res) {

    Ride.findOne({
        "_id": req.body.rideID
    }, function(err, ride) {
        if(err) {
            res.json(err);
        }
        else {
            ride.passengers.push({"_user":req.user.id});
            ride.save(function(error, addedPassenger) {
                if (error) {
                    res.json(error);
                } else {
                    Account.findOne({
                      "_id": ride._owner
                    }, function(err,rideOwner) {
                      if(err) {
                      }
                      else {

                        var notification = {
                          _sender: req.user.id,
                          type: "Enter",
                          _ride: ride._id,
                          rideType: ride.ride_type,
                          rideTime: ride.time_start
                        };
                        rideOwner.notifications.push(notification);
                        rideOwner.save(function(error, addedNotification) {
                            if (error) {
                              res.json('notificationError');
                            }
                        });
                      }
                    });
                    res.json(addedPassenger);
                }
            });
        }
    });

}

module.exports.requestsRide = requestRide;


function requestRideDeletion(req,res) {

    Ride.findOneAndUpdate({
            "_id": req.body.rideID
        },
        {$pull:{passengers: {_user: req.user.id}}},
        function(err, ride) {
            if(err) {
                res.json(err);
            }
            else {
                Account.findOne({
                  "_id": ride._owner
                }, function(err,rideOwner) {
                  if(err) {
                  }
                  else {

                    var notification = {
                      _sender: req.user.id,
                      type: "Exit",
                      _ride: ride._id,
                      rideType: ride.ride_type,
                      rideTime: ride.time_start
                    };
                    rideOwner.notifications.push(notification);
                    rideOwner.save(function(error, addedNotification) {
                        if (error) {
                            console.log("notificationError");
                        }
                    });
                  }
                });
                res.json(ride);
            }
        });

}

module.exports.deleteRequestedRide = requestRideDeletion;


function feedbackRide(req,res) {

    var alreadyGaveFeedback = false;
    var userInRide = false;

    Ride.findOne({
        "_id": req.body.rideID
    }, function(err, data) {
        if(err) {
            res.json(err);
        }
        else {

            for(var i =0; i < data.passengers.length; i++) {
                if(data.passengers[i]._user == req.user.id) {
                    userInRide = true;
                }
            }
            for(var i =0; i < data.feedback.length; i++) {
                if(data.feedback[i]._user == req.user.id) {
                    alreadyGaveFeedback = true;
                }
            }
            if(!alreadyGaveFeedback && userInRide) {
                data.feedback.push({"_user":req.user.id, "feedback":req.body.feedback, "message":req.body.message});
                data.save(function(error, addedFeedback) {
                        if (error) {
                            res.json(error);
                        } else {
                            res.json(addedFeedback);
                        }
                        for(var i =0; i < data.feedback.length; i++) {
                            if(data.feedback[i]._user == req.user.id) {
                                alreadyGaveFeedback = true;
                            }
                        }
                        if(!alreadyGaveFeedback && userInRide) {
                            data.feedback.push({"_user":req.user.id, "feedback":req.body.feedback, "message":req.body.message});
                            data.save(function(error, addedFeedback) {
                                if (error) {
                                    res.json(error);
                                } else {
                                    res.json(addedFeedback);
                                }
                            });
                        }
                    }

                );
            }}});

}

module.exports.rideFeedback = feedbackRide


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
                    res.json(err);
                } else {
                    res.json(myRides);
                }
            });
        }
    });

}

module.exports.myRides = getMyRides;


function rideEdit(req, res) {

    if(req.body.ride_type == 'CT' || req.body.ride_type == 'TC') {
        HomeAndWorkRide.findOneAndUpdate( {'_id': req.body.rideID},
            {
                'seats': req.body.seats,
                'time_start': req.body.time_start,
                'ride_type': req.body.ride_type,
                'type_cost': req.body.type_cost,
                'cost': req.body.cost,
                'locationName': req.body.locationName,
                'homeLocation' : {
                    "district": req.body.homeLocation.district,
                    "municipality": req.body.homeLocation.municipality,
                    "street": req.body.homeLocation.street,
                    "info": req.body.homeLocation.info
                }
            }, function(error, ride) {
                if(error) {
                    res.json(error);
                }
                else {
                  for(var i =0; i < ride.passengers.length; i++) {
                    Account.findOne({
                      "_id": ride.passengers[i]._user
                    }, function(err,passenger) {
                      if(err) {

                      }
                      else {

                        var notification = {
                          _sender: ride._owner,
                          type: "Edit",
                          _ride: req.body.rideID,
                          rideType: ride.ride_type,
                          rideTime: ride.time_start
                        }
                        passenger.notifications.push(notification);
                        passenger.save(function(error, addedNotification) {
                            if (error) {
                            } else {
                            }
                        });
                      }
                    });
                  }
                  res.json(ride);
                }
            });
    }
    else if(req.body.ride_type == 'Ocasional') {

        OccasionalRide.findOneAndUpdate( {'_id': req.body.rideID},
            {
                'seats': req.body.seats,
                'time_start': req.body.time_start,
                'ride_type': req.body.ride_type,
                'type_cost': req.body.type_cost,
                'cost': req.body.cost,
                'startLocation' : {
                    "address": req.body.startLocation.address,
                    "identifier": req.body.startLocation.identifier
                },
                'destination' : {
                    "address": req.body.destination.address,
                    "identifier": req.body.destination.identifier
                }
            }, function(error, data) {
                if(error) {
                    res.json(error);
                }
                else {
                  for(var i =0; i < ride.passengers.length; i++) {
                    Account.findOne({
                      "_id": ride.passengers[i]._user
                    }, function(err,passenger) {
                      if(err) {

                      }
                      else {

                        var notification = {
                          _sender: ride._owner,
                          type: "Edit",
                          _ride: req.body.rideID,
                          rideType: ride.ride_type,
                          rideTime: ride.time_start
                        }
                        passenger.notifications.push(notification);
                        passenger.save(function(error, addedNotification) {
                            if (error) {
                            } else {
                            }
                        });
                      }
                    });
                  }
                  res.json(ride);
                }
            });
    }
}

module.exports.editRide = rideEdit;


function rideInfoEdit(req, res) {

    if(req.body.ride_type == 'CT' || req.body.ride_type == 'TC') {
        RideInfo.findOneAndUpdate( {'_id': req.body.rideInfoID},
            {
                'seats': req.body.seats,
                'time_start': req.body.time_start,
                'ride_type': req.body.ride_type,
                'cost': req.body.cost,
                'name': req.body.rideInfoName,
                'locationName': req.body.locationName,
                'homeLocation' : {
                    "district": req.body.homeLocation.district,
                    "municipality": req.body.homeLocation.municipality,
                    "street": req.body.homeLocation.street,
                    "info": req.body.homeLocation.info
                }
            }, function(error, data) {
                if(error) {
                    res.json(error);
                }
                else {
                    res.json(data);
                }
            });
    }
    else if(req.body.ride_type == 'Ocasional') {

        RideInfo.findOneAndUpdate( {'_id': req.body.rideID},
            {
                'seats': req.body.seats,
                'time_start': req.body.time_start,
                'ride_type': req.body.ride_type,
                'type_cost': req.body.type_cost,
                'cost': req.body.cost,
                'name': req.body.rideInfoName,
                'startLocation' : {
                    "address": req.body.startLocation.address,
                    "identifier": req.body.startLocation.identifier
                },
                'destination' : {
                    "address": req.body.destination.address,
                    "identifier": req.body.destination.identifier
                }
            }, function(error, data) {
                if(error) {
                    res.json(error);
                }
                else {
                    res.json(data);
                }
            });
    }
}

module.exports.editRideInfo = rideInfoEdit;


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
                        callback('error');
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
                    res.json(err);
                } else {
                    res.json(myRequestedRides);
                }
            });
        }
    });

}

module.exports.myRequestedRides = getMyRequestedRides;


function getRideToEdit(req, res) {
    Ride.findOne({
        "_id": req.query.rideID
    }, function(error,data) {
        if(error) {
            res.json(error);
        }
        else {
            res.json(data);
        }
    });
}

module.exports.rideToEdit = getRideToEdit;


function getRideInfoToEdit(req, res) {
    RideInfo.findOne({
        "_id": req.query.rideInfoID
    }, function(error,data) {
        if(error) {
            res.json(error);
        }
        else {
            res.json(data);
        }
    });
}

module.exports.rideInfoToEdit = getRideInfoToEdit;


function getRide(req, res) {

    var rideID = JSON.parse(JSON.stringify(req.query.rideID));

    Ride.findOne({
        $and: [
            { '_id': rideID }/*,
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
                ride_type : data.ride_type,
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
                        callback();
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
                if( err ) {
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
                            RideInfo.ownerID = ownerID;
                            RideInfo.ownerName = data.name;
                            RideInfo.ownerPhoto = data.photo;

                            if (rideType != 'Ocasional') {

                                WorkLocation.findOne({
                                    '_id': wLocation
                                }, function (err, data) {
                                    if (err || data === null) {
                                        res.json(err);
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
            res.json(err);
        }
        else {

            var allRides = [];

            async.each(data, function(ride, callback) {
                var rideInfo = {
                    _id : ride.id,
                    seats : ride.seats,
                    date : ride.time_start,
                    type_cost : ride.type_cost,
                    cost : ride.cost,
                    name : ride.name,
                    ride_type : ride.ride_type,
                    _workLocation : ride._workLocation,
                    homeLocation : ride.homeLocation
                };

                allRides.push(rideInfo);
                callback();

            }, function(err){
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                    res.json(err);
                } else {
                    res.json(allRides);
                }
            });

        }
    });

}

module.exports.myDefaultRides = getMyDefaultRides;

function getRideForDay(req,res) {

    var initDate = new Date(req.query.searchDate);
    var endDate = new Date(req.query.searchDate);
    endDate.setDate(endDate.getDate() + 1);

    Ride.find({
        $and: [
            { state: 'active' },
            { time_start: { $gte: initDate } },
            { time_start: { $lt: endDate } },
            { seats: { $gte: 0}}
        ]
    }, function(err, data) {
        if (err || data === null) {
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
                    destination : '',
                    rideType : ride.ride_type,
                    municipality : '',
                    district : '',
                    street : '',
                    workLocation : ''
                };

                var wLocation = ride._workLocation;
                var rideType = ride.ride_type;

                if(rideType === 'Ocasional'){
                    RideInfo.startLocation = ride.startLocation.identifier;
                    RideInfo.destination = ride.destination.identifier;
                }else{
                    RideInfo.municipality = ride.homeLocation.municipality;
                    RideInfo.district = ride.homeLocation.district;
                    RideInfo.street = ride.homeLocation.street;
                }

                if (rideType !== 'Ocasional') {

                    WorkLocation.findOne({
                        '_id': wLocation
                    }, function (err, data) {
                        if (err || data === null) {
                            callback('error');
                        } else {
                            RideInfo.workLocation = data.name;
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
                    res.json(err);
                } else {
                    res.json(myRides);
                }
            });
        }
    });



}

module.exports.getRideForDay = getRideForDay;




function getMyPastRides(req, res) {

    Ride.find({
        $and: [
            { passengers: {
                $elemMatch: {
                    _user: req.user.id
                }
            }},
            { state: 'active' },
            { time_start: { $lt: Date.now() } }
        ]
    }, function(err, data) {
        if (err || data === null) {
            res.json(err);
        } else {
            var myPastRides = [];

            async.each(data, function(ride, callback) {
                var RideInfo = {
                    id : ride._id,
                    date : ride.time_start,
                    startLocation : '',
                    destination : '',
                    ownerName : '',
                };

                var wLocation = ride._workLocation;
                var rideType = ride.ride_type;
                var ownerID = ride._owner;
                var alreadyGaveFeedback = false;


                for (var i = 0; i < ride.feedback.length; i++) {
                    if(ride.feedback[i]._user == req.user.id) {
                        alreadyGaveFeedback = true;
                    }

                }


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
                        callback('error');
                    } else {
                        RideInfo.ownerName = data.name;
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
                                    if (!alreadyGaveFeedback) {
                                        myPastRides.push(RideInfo);

                                    }
                                    callback();
                                }
                            });
                        } else{
                            myPastRides.push(RideInfo);
                            callback();
                        }
                    }});

            }, function(err){
                if( err ) {
                    res.json(err);
                } else {
                    res.json(myPastRides);
                }
            });
        }
    });

}

module.exports.myPastRides = getMyPastRides;
