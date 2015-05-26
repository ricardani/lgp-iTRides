var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var bodyParser = require('body-parser');
var accountRoutes = require('./routes/account');
var rideRoutes = require('./routes/ride');
var profileRoutes = require('./routes/profile');
var adminRoutes = require('./routes/admin');

//Tokens
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var secret_key = 'shhhhhhared-secret';

//Upload Img
var cloudinary = require('cloudinary');
var multipart = require('connect-multiparty');

cloudinary.config({
    cloud_name: 'itrides',
    api_key: '762121457153785',
    api_secret: 'BqGaghi1-90xbwtoHeALi7cJVyk'
});

var app = express();

app.use(bodyParser());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, content-type, x-access-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        // Bypass browser's CORS options requests
        res.sendStatus(200);
    } else {
        // Pass to next layer of middleware
        next();
    }
});

mongoose.connect('mongodb://itrides:itridesadmin1@ds037581.mongolab.com:37581/itrides');

//load all files in models dir
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
    if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('connection to mongoDB sucesseful');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(multipart({
    uploadDir: './tmp'
}));

app.use('/user', accountRoutes);
// We are going to protect /api routes with JWT
app.use('/api', expressJwt({secret: secret_key}));
app.use('/api/ride', rideRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

app.get('/connect', function (req, res) {
    res.sendStatus(200);
});

app.set('port', (process.env.PORT || 5000));
app.use('/', express.static(__dirname + '/public/index'));

app.use('/user/accountConfirmed', express.static(__dirname + '/public/accountConfirmed'));

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
