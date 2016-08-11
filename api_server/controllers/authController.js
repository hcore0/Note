var service = require('../../app_server/services/authService');

//用户注册
exports.regist = function (req, res) {
    service.regist({
        account: req.body.account,
        password: req.body.password,
        nickname: req.body.nickname
    }).then(user => {
        res.status(201);
        res.json(user);
    }, err => {
        res.status(400);
        res.json(err);
    });
};

//用户登录
exports.login = function (req, res) {
    service.login({
        account: req.body.account,
        password: req.body.password
    }).then(user => {
        res.status(200);
        res.json(user);
    }, err => {
        res.status(401);
        res.json(err);
    });
};

//退出
exports.logout = function (req, res) {
    res.status(200);
    res.end();
};