var Account = require('../models/account');
var sha1 = require('sha1');

function register(req, res) {
  var hash, temp;
  console.log(req);
  hash = sha1(req.body.password);
  temp = req.body;
  temp.password = hash;
  var person = new Account(temp);
  person.save(function(error, data) {
    if (error) {
      res.json(error);
    } else {
      res.json(data);
    }
  });

  //common.email(req.body.email, "Acteam Network", "Hello, Confirmation Link: http://" + req.headers.host + "/confirmaccount?code=" + sha1(req.body.email + req.body.name) + "&email=" + req.body.email + " Acteam Group");
}

module.exports.reg = register;
