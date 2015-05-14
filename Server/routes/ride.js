var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
rides = require('../dbops/ride');

router.post('/createRide', rides.createRide);

router.post('/getRides', rides.getallRides);

router.post('/deleteRide', rides.deleteRide);

router.post('/createRideInfo', rides.createRideInfo);

router.post('/requestRide', rides.requestsRide);

router.post('/deleteRequestedRide', rides.deleteRequestedRide);

router.post('/rideFeedback', rides.rideFeedback);

router.get('/getWorkLocations', rides.workLocations);

router.post('/getWorkLocation', rides.oneWorkLocation);

router.get('/getRide', rides.oneRide);

router.get('/getMyRides', rides.myRides);

router.get('/getMyRequestedRides', rides.myRequestedRides);

router.get('/getMyDefaultRides', rides.myDefaultRides);

router.get('/getRideForDay', rides.getRideForDay);

module.exports = router;
