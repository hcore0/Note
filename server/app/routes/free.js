var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/authController');

router.get('/', function (req, res) {
    res.render('index');
});
router.get('/auth/login', function (req, res) {
    res.render('auth/login');
});
router.get('/auth/regist', function (req, res) {
    res.render('auth/regist');
});
router.get('/auth/logout', authCtrl.logout);
router.post('/auth/login', authCtrl.login);
router.post('/auth/regist', authCtrl.regist);

module.exports = router;