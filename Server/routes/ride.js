var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
rides = require('../dbops/ride');

router.post('/createCR', rides.createCustomRide);

router.post('/createDR', rides.createDefaultRide);

module.exports = router;
