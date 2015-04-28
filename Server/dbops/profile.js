var OccasionalRide = require('../models/occasionalRide');
var Account = require('../models/account');
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
            /*var senderInfo = [];

             for(i = 0; i < notifications.length; i++) {
             Account.findOne({
             '_id': notifications[i].sender
             }, function(err, data) {
             if (err) {
             console.log(err);
             res.json(err);
             }else{
             var senderData = {
             senderId : data._id,
             senderName : data.name,
             senderPhoto : data.photo
             };

             senderInfo.push(senderData);
             //console.log(senderInfo);
             }
             });
             }
             console.log(senderInfo);*/
            //res.json(notifications);
            //res.json(data);
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
};

module.exports.information = getProfileInfo;
 