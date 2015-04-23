var CustomRide = require('../models/customRide');
var DefaultRide = require('../models/defaultRide');
var Account = require('../models/account');
var WorkLocation = require('../models/workLocation');

function customRideCreation(req, res) {

  Account.findOne({
    "email": req.body.owner_email
  })
  .populate('_id')
  .exec( function(err,owner) {
    if(err) {
      res.json(err);
    }
    else {
      var customRide = new CustomRide(req.body);
      customRide._owner = owner;

      customRide.save(function(error, data) {
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

module.exports.createCustomRide = customRideCreation;
/*
{
  "owner_email":"j.miguelgsantos@hotmail.com",
  "ride_type":"custom",
  "time_start":"1970-01-01T15:55:00.000Z",
  "startLocation": {
            "district" : "distrito",
            "municipality" : "concelho",
            "street" : "rua"
        },
  "destination":
        {
            "district" : "distrito",
            "municipality" : "concelho",
            "street" : "rua"
        }
}
*/

function defaultRideCreation(req, res) {

  Account.findOne({
    "email": req.body.owner_email
  })
  .populate('_id')
  .exec( function(err,owner) {
    if(err) {
      res.json(err);
    }
    else {

      /* Get start location id */
      WorkLocation.findOne({
        "name" : req.body.startLocation.name
      })
      .populate('_id')
      .exec(function(error, start) {
        if(error) {
          res.json("Starting location not found");
        }
        else {

          /* Get destination location id */
          WorkLocation.findOne({
            "name" : req.body.destination.name
          })
          .populate('_id')
          .exec(function(error, finish) {
            if(error) {
              res.json("Destination location not found");
            }
            else {

              var defaultRide = new DefaultRide(req.body);
              defaultRide._owner = owner;
              defaultRide._startLocation = start._id;
              defaultRide._destination = finish._id;
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

      console.log(JSON.stringify(req.body.startLocation) + "\n\n" +
                  JSON.stringify(req.body.destination));


      CustomRide.findOne({
            "owner": owner._id,
            "time_start": req.body.time_start
          })
          .populate('_startLocation')
          .populate('_destination')
          .exec( function(error, ride) {

            if (error) {
              res.json(error);
            }
            else if(ride != null) {

              console.log(ride);

              Account.findOne({
                "email": req.body.newPassengerEmail
              }, function(err, passenger) {
                if(err) {
                  res.json(err);
                }
                else {
                  console.log("Woohoo!  " + passenger._id)
                  //ride.passengers.push({"user": passenger._id});
                  res.json(passenger);
                }
              })

            }
            else
              res.json("couldn't find ride");

          })

      })

    }

}

module.exports.requestsRide = requestRide;
/*
{
  "newPassengerEmail": "ei11057@fe.up.pt",
  "owner_email":"j.miguelgsantos@hotmail.com",
  "ride_type":"custom",
  "owner":"553135f5219a7ad40c67bbc3",
  "time_start":"1970-01-01T15:55:00.000Z",
  "startLocation": [{
            "district" : "distrito",
            "municipality" : "concelho",
            "street" : "rua"
        }],
  "destination":[
        {
            "district" : "distrito",
            "municipality" : "concelho",
            "street" : "rua"
        }
    ]
}
*/
