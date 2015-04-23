var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
profiles = require('../dbops/profile');

router.get('/getNotifications', profiles.notifications);

/*
router.post('/createCR', rides.createCustomRide);

router.post('/createDR', rides.createDefaultRide);

router.post('/deleteRide', rides.deleteRide);

router.post('/requestRide', rides.requestsRide);
*/

module.exports = router;
