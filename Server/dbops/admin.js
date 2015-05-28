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
            console.log('Can`t find accounts');
            res.json(err);
        } else {
            res.json(data);
        }
    });
}

module.exports.getUsers = getAccounts;
