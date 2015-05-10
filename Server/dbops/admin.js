var WorkLocation = require('../models/workLocation');
var Account = require('../models/account');

function getWorkLocations(req, res) {
    WorkLocation.find({}, function(err, data) {
        if (err || data === null) {
            console.log('Can`t find workLocations');
            res.json(err);
        } else {
            res.json(data);
        }});
}

module.exports.workLocations = getWorkLocations;


function WorkLocationCreation(req, res) {

    //TODO Verifica se existe um local de trabalho com o nome pedido contando o numero de locais de trabalho com esse nome
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
        "name": req.body.workLocationName
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
  Account.findOne({
    "_id": req.body.userID
  }).remove(function(error, data) {
      if (error) {
          res.json(error);
      } else {
          res.json(data);
      }
  });
}

module.exports.banUser = banAccount;


function getAccounts(req, res) {
  Account.find({}, function(err,data) {
    if (err || data === null) {
        console.log('Can`t find accounts');
        res.json(err);
    } else {
        res.json(data);
    }
  });
}

module.exports.getUsers = getAccounts;
