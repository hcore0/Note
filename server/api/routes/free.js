var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/authController');

router.post('/login', authCtrl.regist);
router.post('/regist', authCtrl.login);

module.exports = router;