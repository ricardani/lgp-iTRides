var Account = require('../models/account');
var sha256 = require('sha256');
var mandrill = require('node-mandrill')('Kj-1SGPKFICoSgUIo9OEqw');
//Tokens
var jwt = require('jsonwebtoken');
var secret_key = 'shhhhhhared-secret';

function sendMail(who, title, msg) {
  mandrill('/messages/send', {
    message: {
      to: [{
        email: who,
        name: "iTRides"
      }],
      from_email: "no-reply@LGPiTRides.com",
      subject: title,
      html: msg
    }
  }, function(error, response) { //uh oh, there was an error
    if (error) console.log(JSON.stringify(error));
    //everything's good, lets see what mandrill said
    else console.log(response);
  });
}

function register(req, res) {
  var hash, temp;
  hash = sha256(req.body.password);
  temp = req.body;
  temp.name = req.body.firstName + " " + req.body.lastName;
  temp.password = hash;
  var person = new Account(temp);
  person.save(function(error, data) {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      res.json(data);
    }
  });

  sendMail(req.body.email, "iTRides Account Confirmation", "Hello, Confirmation Link: <br><br> <a href=\"http://localhost:8080/api/user/confirmAccount?code=" + sha256(req.body.email + req.body.name) + "&email=" + req.body.email +"\"> LINK </a> <br><br> LGP iTRides");
}

module.exports.reg = register;

function accountConfirmation(req, res) {
  Account.findOne({
    email: req.query.email
  }, function(err, user) {
    if (sha256(user.email + user.name) === req.query.code) {
      user.activated = true;
      user.save(function(err) {
        if (err) {
          console.log("oops");
        } else {
          console.log("woohoo!");
        }
      });
    }
  });
}

module.exports.confirmAccount = accountConfirmation;

function login(req, res) {
  Account.findOne({
    email: req.body.email,
    password: sha256(req.body.password)
  }, function(err, data) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      var profile = {
        email: data.email
      };
      var token = jwt.sign(profile, secret_key, { expiresInMinutes: 60 });
      res.json({ activated: data.activated,token: token });
      //res.json(data);
    }
  });
}

module.exports.checkLogin = login;
