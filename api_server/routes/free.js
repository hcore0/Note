var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/authController');

router.post('/api/login', authCtrl.regist);
router.post('/api/regist', authCtrl.login);

module.exports = router;