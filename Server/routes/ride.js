var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
rides = require('../dbops/ride');

router.post('/createRide', rides.createRide);

router.post('/getRides', rides.getallRides);

router.post('/deleteRide', rides.deleteRide);

router.post('/createRideInfo', rides.createRideInfo);

router.post('/requestRide', rides.requestsRide); //TODO enviar notificação

router.post('/deleteRequestedRide', rides.deleteRequestedRide); //TODO enviar notificação

router.post('/rideFeedback', rides.rideFeedback);

router.get('/getWorkLocations', rides.workLocations);

router.post('/getWorkLocation', rides.oneWorkLocation);

router.get('/getRideToEdit', rides.rideToEdit);

router.get('/getRide', rides.oneRide);

router.get('/getMyRides', rides.myRides);

router.post('/editRide', rides.editRide);

router.get('/getMyRequestedRides', rides.myRequestedRides);

router.get('/getMyDefaultRides', rides.myDefaultRides);

router.get('/getRideForDay', rides.getRideForDay);

router.get('/getMyPastRides', rides.myPastRides);

//router.get('/getFeedback', rides.feedback);

module.exports = router;
