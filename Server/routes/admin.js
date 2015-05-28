var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
administrator = require('../dbops/admin');

router.get('/getWorkLocations', administrator.workLocations);

router.post('/createWorkLocation', administrator.createWorkLocations);

router.post('/deleteWorkLocation', administrator.deleteWorkLocations);

router.post('/banUser', administrator.banUser);

router.post('/promoteUser', administrator.promoteUser);

router.post('/getUsers', administrator.getUsers);

module.exports = router;
