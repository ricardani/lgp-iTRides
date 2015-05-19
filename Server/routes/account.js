var express = require('express');
var mongoose= require('mongoose');
var router = express.Router();
authenticate = require('../dbops/account');

router.post('/register', authenticate.reg);

router.get('/confirmAccount', authenticate.confirmAccount);

router.post('/login', authenticate.checkLogin);

router.post('/resetPassword', authenticate.passwordReset);

module.exports = router;
