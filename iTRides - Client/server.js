var express = require('express');
var mongoose = require('mongoose');

var app = express();

app.use(express.static('www'));

mongoose.connect('mongodb://itrides:itridesadmin1@ds037581.mongolab.com:37581/itrides');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('yay!');
});

app.listen(8080);
console.log("App listening on port 8080");
