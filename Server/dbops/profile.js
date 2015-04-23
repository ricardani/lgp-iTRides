var CustomRide = require('../models/customRide');
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






/*
function customRideCreation(req, res) {
  var customRide = new CustomRide(req.body);
  customRide.startLocation.push(req.body.startLocation);
  customRide.destination.push(req.body.destination);

  customRide.save(function(error, data) {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      res.json(data);
    }
  });

}

module.exports.createCustomRide = customRideCreation;

function defaultRideCreation(req, res) {
  var defaultRide = new DefaultRide(req.body);
  defaultRide.startLocation.push(req.body.startLocation);
  defaultRide.destination.push(req.body.destination);

  defaultRide.save(function(error, data) {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      res.json(data);
    }
  });

}

module.exports.createDefaultRide = defaultRideCreation;

function removeRide(req, res) {
  console.log('hey');
  if(req.body.ride_type == 'default') {
    DefaultRide.findOne({
        "name": req.body.name
      }).remove(function(error, data) {
        if (error) {
          res.json(error);
        } else
          res.json(data);
      });
  }
  else if(req.body.ride_type == 'custom') {
    CustomRide.findOne({
        "owner": req.body.owner,
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
    DefaultRide.findOne({
        "name": req.body.rideName
      }, function(error, data) {
        if (error) {
          res.json(error);
        } else {
          res.json(data);
        }
      });
  }
  else if(req.body.ride_type == 'custom') {

    Account.findOne({
      "email": req.body.owner_email
    })
    .populate('_id')
    .exec ( function(err, owner) {

      CustomRide.findOne({
            "owner": owner._id,
            "time_start": req.body.time_start,
            "startLocation": req.body.startLocation,
            "destination": req.body.destination
          }, function(error, data) {
            if (error) {
              res.json(error);
            }
            else if(data != null) {
              Account.findOne({
                "email": req.body.newPassengerEmail
              }, function(err, passenger) {
                if(err) {
                  res.json(err);
                }
                else {
                  data.passengers.push({"user": passenger._id});
                  res.json(data);
                }
              })

            }
            else
              res.json("couldn't find ride");
          });
      })

    }

}

module.exports.requestsRide = requestRide;
*/