var OccasionalRide = require('../models/occasionalRide');
var Account = require('../models/account');
var Ride = require('../models/ride').rideModel;
var WorkLocation = require('../models/workLocation');
var async = require('async');
var sha256 = require('sha256');

function getNotifications(req, res) {
    Account.findOne({
        '_id': req.user.id
    }, function(err, data) {
        if (err || data === null) {
            console.log(err);
            res.json(err);
        } else {
            var notifications = data.notifications;
            var senderInfo = [];

            async.eachSeries(notifications, function(n, callback) {
                var noti_obj = JSON.parse(JSON.stringify(n));
                var senderID = noti_obj._sender;
                var rideID = noti_obj._customRideId;

                Account.findOne({
                    '_id': senderID
                }, function(err, data) {
                    if (err || data === null) {
                        console.log(err);
                        callback('error');
                    }else{
                        var notificationsData = {
                            name : data.name,
                            photo : data.photo,
                            msgType : noti_obj.type,
                            rideID : '',
                            rideDate : ''
                        };

                        Ride.findOne({
                            '_id': rideID
                        }, function(err, data) {
                            if (err || data === null) {
                                console.log(err);
                                callback('error');
                            }else{
                                notificationsData.rideID = rideID;
                                notificationsData.rideDate = data.time_start;

                                senderInfo.push(notificationsData);
                                callback();
                            }
                        });
                    }
                });

            }, function(err){
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                    // One of the iterations produced an error.
                    // All processing will now stop.
                    res.json(err);
                    console.log(err);
                } else {
                    //console.log(senderInfo);
                    res.json(senderInfo);
                }
            });
        }
    });

}

module.exports.notifications = getNotifications;

function getProfileInfo(req, res) {
    Account.findOne({
        '_id': req.user.id
    }, function(err, data) {
        if (err || data === null) {
            console.log(err);
            res.json(err);
        } else {
            var information = {
                name : data.name,
                photo : data.photo,
                contact : data.contact,
                email: data.email
            };
            res.json(information);
        }});
}

module.exports.information = getProfileInfo;

function getNextRide(req, res) {
    Ride.findOne({
        $and: [
            { '_owner': req.user.id },
            { state: 'active' },
            { time_start: { $gte: Date.now() } }
        ]
    }, function(err, data) {
        if (err || data === null) {
            console.log(err);
            res.json(err);
        } else {

            var RideInfo = {
                id : data._id,
                date : data.time_start,
                passengers : [],
                startLocation : '',
                destination : ''
            };

            var wLocation = data._workLocation;
            var rideType = data.ride_type;

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
                        console.log(err);
                        callback('error');
                    }else{
                        var user = {
                            name : data.name,
                            photo : data.photo,
                            date : registerDate
                        };

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
                    console.log(err);
                } else {
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
                                res.json(RideInfo);
                            }
                        });

                    }else{
                        res.json(RideInfo);
                    }

                }
            });

            //res.json(data);
        }}).sort({time_start : 1}).limit(1);

}

module.exports.nextRide = getNextRide;

function getNextRequestedRide(req, res) {
    Ride.findOne({
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

            var RideInfo = {
                id : data._id,
                date : data.time_start,
                startLocation : '',
                destination : '',
                ownerName : '',
                ownerPhoto : ''
            };

            var wLocation = [data._workLocation];
            var rideType = data.ride_type;
            var ownerID = data._owner;

            if(rideType === 'CT'){
                RideInfo.startLocation = data.homeLocation.street + ', ' + data.homeLocation.municipality + ', ' + data.homeLocation.district;
            }else if(rideType === 'TC'){
                RideInfo.destination = data.homeLocation.street + ', ' + data.homeLocation.municipality + ', ' + data.homeLocation.district;
            }else if(rideType === 'Ocasional'){
                RideInfo.startLocation = data.startLocation.identifier;
                RideInfo.destination = data.destination.identifier;
            }

            Account.findOne({
                '_id': ownerID
            }, function(err, data) {
                if (err || data === null) {
                    console.log(err);
                    res.json(err);
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
                                res.json(RideInfo);
                            }
                        });

                    }else{
                        res.json(RideInfo);
                    }
                }});

        }}).sort({time_start : 1}).limit(1);

}

module.exports.nextRequestedRide = getNextRequestedRide;



function updateProfile(req, res) {
    Account.update(
       {'_id': req.user.id},
       {
        'name' : req.body.name,
        'contact' : req.body.contact,
        //photo: req.body.photo,
       },
       { upsert: true },
       function(err, data) {
        if(err) {
            res.json(err);
        } else {
            res.json(data);
        }
       }
    );
}

module.exports.profileUpdate = updateProfile;

function updateProfilePassword(req, res) {
    var user_old_password;
    Account.findOne({'_id' : req.user.id}, 
        function(err, data) {
            if (err || data === null) {
                console.log(err);
                res.json(err);
            } else {
                user_old_password = data.password;
                if (sha256(req.body.old_password) == user_old_password){
                    Account.update(
                       {'_id': req.user.id},
                       {
                        'name' : req.body.name,
                        'contact' : req.body.contact,
                        'password' : sha256(req.body.new_password)
                        //photo: req.body.photo,
                       },
                       { upsert: true },
                       function(err, data) {
                        if(err) {
                            res.json(err);
                        } else {
                            res.json(data);
                        }
                       }
                    );
                }

            }
        }   
    );

    console.log('password changed');    
}

module.exports.profileUpdatePassword = updateProfilePassword;


