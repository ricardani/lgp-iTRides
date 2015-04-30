var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
administrator = require('../dbops/admin');

router.get('/getWorkLocations', administrator.workLocations);

module.exports = router;
