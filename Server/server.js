var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var bodyParser = require('body-parser');
var accountRoutes = require('./routes/account');
var rideRoutes = require('./routes/ride');

//Tokens
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var secret_key = 'shhhhhhared-secret';

var app = express();

app.use(bodyParser());

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

app.use(express.static('../Client/www'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', accountRoutes);
// We are going to protect /api routes with JWT
app.use('/api', expressJwt({secret: secret_key}));
app.use('/api/ride', rideRoutes);
app.use('/ride', rideRoutes);

app.listen(8080);
console.log("App listening on port 8080");

module.exports = app;
