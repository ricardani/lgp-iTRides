var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
profiles = require('../dbops/profile');

router.get('/getNotifications', profiles.notifications);

router.get('/removeNotifications', profiles.removeNotifications);

router.post('/removeNotification', profiles.removeNotification);

//Request GET that responds with the current user's profile data
router.get('/getProfileInfo', profiles.information);

//Request GET that responds with the requested user's profile data
router.post('/getUserInfo', profiles.userInfo);

router.get('/getNextRide', profiles.nextRide);

router.get('/getNextRequestedRide', profiles.nextRequestedRide);

router.post('/updatePenalties', profiles.penaltiesUpdate);

router.post('/updateProfile', profiles.profileUpdate);

router.post('/updateImg', profiles.updateImg);

router.post('/updateProfilePassword', profiles.profileUpdatePassword);

router.get('/getUserFeedback', profiles.userFeedback);

router.get('/getAllUsers', profiles.getAllUsers);

module.exports = router;
