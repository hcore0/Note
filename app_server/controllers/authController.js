var service = require('../services/authService');

//用户注册
exports.regist = function (req, res) {
    service.regist({
        account: req.body.account,
        password: req.body.password,
        nickname: req.body.nickname
    }).then(user => {
        req.session.user = user;
        req.session.flash = {
            type: 'success',
            message: `你的账号${user.account}已注册成功!`
        };
        res.redirect('/');
    }, err => {
        req.session.flash = err;
        res.redirect('/auth/regist');
    });
};

//用户登录
exports.login = function (req, res) {
    service.login({
        account: req.body.account,
        password: req.body.password
    }).then(user => {
        req.session.regenerate(function () {
            req.session.user = user;
            res.redirect('/');
        });
    }, err => {
        req.session.regenerate(function () {
            req.session.flash = {
                type: 'danger',
                message: err
            };
            res.redirect('/');
        });
    });
};

//退出
exports.logout = function (req, res) {
    req.session.destroy(() => {
        res.redirect('/');
    });
};