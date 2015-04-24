var OccasionalRide = require('../models/occasionalRide');
var Account = require('../models/account');

function getNotifications(req, res) {
  Account.findOne({
    '_id': req.user.id
  }, function(err, data) {
    if (err || data === null) {
      console.log(err);
      res.json(err);
    } else {
      var notifications = data.notifications;
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
      res.json(notifications);
      //res.json(data);
    }
  });

}

module.exports.notifications = getNotifications;
