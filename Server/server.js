var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
authenticate = require('./dbops/account');

var app = express();

mongoose.connect('mongodb://itrides:itridesadmin1@ds037581.mongolab.com:37581/itrides');

//load all files in models dir
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
    console.log(filename);
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('connection to mongoDB sucesseful');
});


app.use(express.static('../iTRides - Client/www'));

app.get('/users', function(req, res) {
  mongoose.model('Account').find(function(err, users) {
    res.send(users);
  });
});

app.post('/register', authenticate.reg);

app.listen(8080);
console.log("App listening on port 8080");
