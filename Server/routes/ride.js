var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
rides = require('../dbops/ride');

router.post('/createRide', rides.createRide);

router.post('/deleteRide', rides.deleteRide);

router.post('/requestRide', rides.requestsRide);

router.get('/getWorkLocations', rides.workLocations);

module.exports = router;
