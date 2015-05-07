var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
rides = require('../dbops/ride');

router.post('/createWorkLocation', rides.createWorkLocations);

router.post('/deleteWorkLocation', rides.deleteWorkLocations);

router.post('/createRide', rides.createRide);

router.post('/deleteRide', rides.deleteRide);

router.post('/createRideInfo', rides.createRideInfo);

router.post('/requestRide', rides.requestsRide);

router.get('/getWorkLocations', rides.workLocations);

router.get('/getRide', rides.oneRide);

router.get('/getMyRides', rides.myRides);

module.exports = router;
