var WorkLocation = require('../models/workLocation');
var Account = require('../models/account');
var async = require('async');

function getWorkLocations(req, res) {
    WorkLocation.find({}, function(err, data) {
        if (err || data === null) {
            res.json(err);
        } else {
            var allInfo = [];

            async.each(data, function(work, callback) {

                var info = {
                    id : work._id,
                    name : work.name,
                    defaultLocation : work.defaultLocation
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
        }});
}

module.exports.workLocations = getWorkLocations;


function WorkLocationCreation(req, res) {

    WorkLocation.count({
        "name": req.body.name
    }, function(err,count) {
        if(count==0) {
            var newWorkLocation = new WorkLocation(req.body);
            newWorkLocation.save(function(error, data) {
                if (error) {
                    res.json(error);
                } else {
                    res.json(data);
                }
            });
        }
        else
            res.json('Já existe um local de trabalho com esse nome');

    });
}
module.exports.createWorkLocations = WorkLocationCreation;


function WorkLocationDeletion(req, res) {
    WorkLocation.findOne({
        "_id": req.body.workLocationID
    }).remove(function(error, data) {
        if (error) {
            res.json(error);
        } else {
            res.json(data);
        }
    });
}

module.exports.deleteWorkLocations = WorkLocationDeletion;


function banAccount(req, res) {

    Account.findOneAndUpdate({
        "_id": req.body.userID
    },
    {
      'activated': false
    }, function(error,user) {
      if(error || user === null) {
        res.json(error);
      }
      else {
        res.json(user);
      }
    });
}

module.exports.banUser = banAccount;


function promUser(req,res) {
   Account.findOneAndUpdate( {'_id': req.body.userID},
            {
                'permission' : 'Admin'
            }, function(error, data) {
                if(error || data === null) {
                    res.json(error);
                }
                else {
                    res.json(data);
                }
            });
}

module.exports.promoteUser = promUser;


function getAccounts(req, res) {
    Account.find({}, function(err,data) {
        if (err || data === null) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
}

module.exports.getUsers = getAccounts;
