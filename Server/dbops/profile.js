var OccasionalRide = require('../models/occasionalRide');
var Account = require('../models/account');
var Ride = require('../models/ride').rideModel;
var WorkLocation = require('../models/workLocation');
var async = require('async');
var sha256 = require('sha256');

var cloudinary = require('cloudinary');
var fs = require('fs');

function getNotifications(req, res) {
    Account.findOne({
        '_id': req.user.id
    }, function(err, data) {
        if (err || data === null) {
            res.json(err);
        } else {
            var notifications = data.notifications;
            var senderInfo = [];

            async.eachSeries(notifications, function(n, callback) {
                var noti_obj = JSON.parse(JSON.stringify(n));
                var senderID = noti_obj._sender;
                var rideID = noti_obj._ride;

                Account.findOne({
                    '_id': senderID
                }, function(err, data) {
                    if (err || data === null) {
                        callback('error');
                    }else{
                        var notificationsData = {
                            _id: noti_obj._id,
                            name : data.name,
                            photo : data.photo,
                            msgType : noti_obj.type,
                            message : noti_obj.message,
                            rideID : '',
                            rideDate : noti_obj.rideTime
                        };

                        if(notificationsData.msgType !== 'Cancel'){

                            Ride.findOne({
                                '_id': rideID
                            }, function(err, data) {
                                if (err || data === null) {
                                    senderInfo.push(notificationsData);
                                    callback();
                                }else{
                                    notificationsData.rideID = rideID;
                                    notificationsData.rideDate = data.time_start;

                                    senderInfo.push(notificationsData);
                                    callback();
                                }
                            });

                        }else{

                            senderInfo.push(notificationsData);
                            callback();

                        }
                    }
                });

            }, function(err){
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                    res.json(err);
                } else {
                    res.json(senderInfo);
                }
            });
        }
    });

}

module.exports.notifications = getNotifications;


function DeleteAllNotifications(req,res) {
    Account.findOneAndUpdate({
            "_id": req.user.id
        },
        {notifications : []},
        function(err,data) {
            if (err || data === null) {
                res.json(err);
            }
            else {
                res.json(data);
            }
        });
}

module.exports.removeNotifications = DeleteAllNotifications;


function DeleteNotification(req,res) {
    Account.findOneAndUpdate({
            "_id": req.user.id
        },
        {$pull:{notifications: {
            "_id": req.body.notificationID}}},
        function(err,data) {
            if (err || data === null) {
                res.json(err);
            }
            else {
                res.json(data);
            }
        });
}

module.exports.removeNotification = DeleteNotification;


function getProfileInfo(req, res) {
    Account.findOne({
        '_id': req.user.id
    }, function(err, data) {
        if (err || data === null) {
            res.json(err);
        } else {
            var feedaverage = 0;
            Ride.find({
                '_owner': req.user.id
            }, function(error, myrides) {
                if (error || myrides === null) {
                    res.json(error);
                } else {
                    var feedbacksum = 0;
                    var count = 0;
                    for (i = 0; i < myrides.length; i++) {
                        for (j = 0; j < myrides[i].feedback.length; j++) {
                            feedbacksum+=myrides[i].feedback[j].feedback;
                            count+=1;
                        }
                    }
                    if(count==0){
                        feedaverage=0;
                    }else{
                        feedaverage = feedbacksum/count;
                    }
                    feedaverage = feedaverage - (data.penalties * 1/5);

                    var information = {
                        id : data._id,
                        name : data.name,
                        photo : data.photo,
                        contact : data.contact,
                        email: data.email,
                        permission: data.permission,
                        residency: data.residency,
                        penalties: data.penalties,
                        feedaverage: feedaverage
                    };
                    res.json(information);
                }});
        }});
}


module.exports.information = getProfileInfo;


function getUserInfo(req, res) {

    Account.findOne({
        '_id': req.body.userID
    }, function(err, requestedUser) {
        if (err || requestedUser === null) {
            res.json(err);
        } else {
            var feedaverage = 0;
            Ride.find({
                '_owner': req.body.userID
            }, function(error, requestedRides) {
                if (error || requestedRides === null) {
                    res.json(error);
                } else {
                    var myRides = [];

                    async.each(requestedRides, function(ride, callback) {
                        var RideInfo = {
                            id : ride._id,
                            date : ride.time_start,
                            feedback : ride.feedback,
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
                            var feedbacksum = 0;
                            var count = 0;
                            for (i = 0; i < myRides.length; i++) {
                                for (j = 0; j < myRides[i].feedback.length; j++) {
                                    feedbacksum+=myRides[i].feedback[j].feedback;
                                    count+=1;
                                }
                            }
                            if(count==0){
                                feedaverage=0;
                            }else{
                                feedaverage = feedbacksum/count;
                            }
                            feedaverage = feedaverage - (requestedUser.penalties * 1/5);

                            var information = {
                                id : requestedUser._id,
                                name : requestedUser.name,
                                photo : requestedUser.photo,
                                contact : requestedUser.contact,
                                email: requestedUser.email,
                                feedaverage: feedaverage,
                                requestedUserRides: myRides
                            };
                            res.json(information);
                        }
                    });
                }
            });
        }
    });
}

module.exports.userInfo = getUserInfo;


function getNextRide(req, res) {
    Ride.findOne({
        $and: [
            { '_owner': req.user.id },
            { state: 'active' },
            { time_start: { $gte: Date.now() } }
        ]
    }, function(err, data) {
        if (err || data === null) {
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
                        callback();
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
                } else {
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

        }}).sort({time_start : 1}).limit(1);

}

module.exports.nextRequestedRide = getNextRequestedRide;

function updatePenalties(req, res) {
    Account.update(
        {'_id': req.user.id},
        {
            'penalties' : req.body.penalties
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

module.exports.penaltiesUpdate = updatePenalties;

function updateProfile(req, res) {
    Account.update(
        {'_id': req.user.id},
        {
            'name' : req.body.name,
            'contact' : req.body.contact,
            'residency' : req.body.residency
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
                res.json(err);
            } else {
                user_old_password = data.password;
                if (sha256(req.body.old_password) == user_old_password){
                    Account.update(
                        {'_id': req.user.id},
                        {
                            'name' : req.body.name,
                            'contact' : req.body.contact,
                            'password' : sha256(req.body.new_password),
                            'residency' : req.body.residency
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
}

module.exports.profileUpdatePassword = updateProfilePassword;


function updateImg(req, res) {

    var file = req.files.file;
    var userID = req.user.id;

    cloudinary.uploader.upload(file.path, function(result) {
        fs.unlink(file.path, function (err) {
            if (err) console.log(err);
        });

        Account.update(
            {'_id': userID},
            {
                photo: result.url
            },
            { upsert: true },
            function(err, data) {
                if(err) {
                    res.json(err);
                } else {
                    res.sendStatus(200);
                }
            }
        );
    });

}

module.exports.updateImg = updateImg;




function getUserFeedback(req, res) {
    Ride.find({
        '_owner': req.user.id
    }, function(error, myRides) {
        if (error || myRides === null) {
            res.json(error);
        } else {
            var feedbackList = [];

            async.each(myRides, function(ride, callback) {

                if( ride.feedback.length === 0)
                    callback();
                else{
                    var information = {
                        rideID : '',
                        user : '',
                        startLocation : '',
                        destination: '',
                        date: '',
                        stars: 0,
                        messages: []
                    };

                    var aux = {
                        ride_type : '',
                        start : '',
                        end : '',
                        user_name : '',
                        workLocation : ''
                    };

                    aux.ride_type = ride.ride_type;
                    aux.workLocation = ride._workLocation;

                    information.rideID = ride._id;
                    information.date = ride.time_start;

                    if(aux.ride_type=="CT"){
                        aux.start = ride.homeLocation.district;
                    } else if(aux.ride_type == "TC"){
                        aux.end = ride.homeLocation.district;
                    } else if(aux.ride_type == "Ocasional") {
                        aux.start = ride.homeLocation.district;
                        aux.end = ride.destination.address;
                    }

                    ride.feedback.forEach(function(feed) {
                        information.stars += feed.feedback;
                        information.messages.push(feed.message);
                    });

                    if( ride.feedback.length > 0)
                        information.stars = information.stars / ride.feedback.length;

                    if(aux.ride_type == "CT" || aux.ride_type == "TC"){
                        WorkLocation.findOne({
                            '_id': aux.workLocation
                        }, function(err2, data2) {
                            if (err2 || data2 === null) {
                                if (aux.ride_type == "CT") {
                                    aux.end = 'Missingno';
                                } else {
                                    aux.start = 'Missingno';
                                }
                            } else {
                                if (aux.ride_type == "CT") {
                                    aux.end = data2.name;
                                } else {
                                    aux.start = data2.name;
                                }
                            }

                            information.startLocation = aux.start;
                            information.destination = aux.end;

                            feedbackList.push(information);

                            callback();
                        });
                    }
                }

            }, function(err){

                if( err ) {
                    res.sendStatus(400);
                } else {
                    res.json(feedbackList);
                }
            });


        }});

}

module.exports.userFeedback = getUserFeedback;


function getAllUsers(req, res) {
    var user_old_password;
    Account.find({activated : true},
        function(err, data) {
            if (err || data === null) {
                res.sendStatus(404);
            } else {

                var allInfo = [];

                async.each(data, function(user, callback) {

                    var info = {
                        id : user._id,
                        name : user.name,
                        photo : user.photo,
                        contact : user.contact,
                        residency : user.residency,
                        email: user.email,
                        permission: user.permission
                    };

                    allInfo.push(info);

                    callback();

                }, function(err){
                    if( err ) {
                        res.sendStatus(400);
                    } else {
                        res.json(allInfo);
                    }
                });
            }
        }
    );
}

module.exports.getAllUsers = getAllUsers;
