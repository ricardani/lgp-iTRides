var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
profiles = require('../dbops/profile');

router.get('/getNotifications', profiles.notifications);

router.get('/getProfileInfo', profiles.information);

router.get('/getNextRide', profiles.nextRide);

router.get('/getNextRequestedRide', profiles.nextRequestedRide);

router.post('/updateProfile', profiles.profileUpdate);

router.post('/updateProfilePassword', profiles.profileUpdatePassword);


/*
router.post('/createCR', rides.createCustomRide);

router.post('/createDR', rides.createDefaultRide);

router.post('/deleteRide', rides.deleteRide);

router.post('/requestRide', rides.requestsRide);
*/

module.exports = router;
