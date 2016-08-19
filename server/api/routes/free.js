var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/authController');

router.post('/login', authCtrl.login);
router.post('/regist', authCtrl.regist);

module.exports = router;