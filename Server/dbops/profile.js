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
                var rideID = noti_obj._customRideId;

                Account.findOne({
                    '_id': senderID
                }, function(err, data) {
                    if (err || data === null) {
                        callback('error');
                    }else{
                        var notificationsData = {
                            name : data.name,
                            photo : data.photo,
                            msgType : noti_obj.type,
                            rideID : '',
                            rideDate : ''
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
                  var feedbacksum = 0;
                  var count = 0;
                  for (i = 0; i < myRides.length; i++) {
                      for (j = 0; j < myRides[i].feedback.length; j++) {
                          feedbacksum+=myRides[i].feedback[j].feedback;
                          count+=1;
                      }
                  }
                  feedaverage=feedbacksum/count;

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
            console.log("Nao encontrou a pr�xima boleia");
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
                        console.log("Nao encontrou o passageiro -> " + userID);
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
                                console.log("Nao encontrou o local de trabalho -> " + wLocation);
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

    console.log('password changed');
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
					var feedbacklist=[];
						for (i = 0; i < myrides.length; i++) {
							for (j = 0; j < myrides[i].feedback.length; j++) {
								var start, end;
								if(myrides[i].ride_type=="CT"){
									start = myrides[i].homeLocation.district;
									end = myrides[i]._workLocation;
								} else if(myrides[i].ride_type == "TC"){
									end = myrides[i].homeLocation.district;
									start = myrides[i]._workLocation;
								} else if(myrides[i].ride_type == "Ocasional") {
									start = myrides[i].homeLocation.district;
									end = myrides[i].destination.address;
								}
								var  user_name = "NULL";
								
								Account.findOne({
									'_id': myrides[i].feedback[j]._user
								}, function(err1, data1) {
									if (err1 || data1 === null) {
										res.json(err1);
									} else {
										user_name = data1.name;
									}
								});
								
								if(myrides[i].ride_type == "CT" || myrides[i].ride_type == "TC"){
									workLocation.findOne({
										'_id': myrides[i]._workLocation
									}, function(err2, data2) {
										if (err1 || data2 === null) {
											res.json(err2);
										} else {
											if (myrides[i].ride_type == "CT" ){
												end = data2.name;
											} else {
												start = data2.name;
											}
										}
									});
								} 	
								
								var information = {
									rideID : myrides[i]._id,
									user : user_name,
									startLocation : start,
									destination: end,
									date: myrides[i].time_start,
									stars: myrides[i].feedback[j].feedback,
									message: myrides[i].feedback[j].message
								};
								feedbacklist.push(information);
                        }
                    }
					res.json(feedbacklist);
                }});
        }});
}

module.exports.userFeedback = getUserFeedback;
