var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
rides = require('../dbops/ride');

router.post('/createCR', rides.createCustomRide);

router.post('/createDR', rides.createDefaultRide);

router.post('/deleteRide', rides.deleteRide);

router.post('/requestRide', rides.requestsRide);

module.exports = router;
