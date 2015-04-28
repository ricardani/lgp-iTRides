var OccasionalRide = require('../models/occasionalRide');
var Account = require('../models/account');
var Ride = require('../models/ride').rideModel;
var WorkLocation = require('../models/workLocation');
var async = require('async');

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
                var senderID = noti_obj.sender;

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
                            msgType : noti_obj.type
                        };

                        senderInfo.push(notificationsData);
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
                destination : '',
                homeLocationInfo : data.homeLocation.info
            };

            var wLocation = [data._workLocation];
            var rideType = data.ride_type;

            if(rideType === 'CT'){
                RideInfo.startLocation = data.homeLocation.street + ', ' + data.homeLocation.municipality + ', ' + data.homeLocation.district;
            }else{
                RideInfo.destination = data.homeLocation.street + ', ' + data.homeLocation.municipality + ', ' + data.homeLocation.district;
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
                    async.each(wLocation, function(w, callback) {
                        var workID = JSON.parse(JSON.stringify(w));

                        WorkLocation.findOne({
                            '_id': workID
                        }, function(err, data) {
                            if (err || data === null) {
                                console.log(err);
                                callback('error');
                            }else{
                                if(rideType === 'TC'){
                                    RideInfo.startLocation = data.name;
                                }else{
                                    RideInfo.destination = data.name;
                                }
                                callback();
                            }
                        });

                    }, function(err){
                        // if any of the file processing produced an error, err would equal that error
                        if( err ) {
                            console.log('A file failed to process');
                        } else {
                            res.json(RideInfo);
                        }
                    });

                }
            });

            //res.json(data);
        }}).sort({time_start : 1}).limit(1);

}

module.exports.nextRide = getNextRide;


