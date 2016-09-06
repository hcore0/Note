var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var service = require('../../services/authService');
var config = require('../../config');
//用户注册
exports.regist = function (req, res) {

    var form = new formidable.IncomingForm();

    form.uploadDir = config.uploadTempDir;
    form.keepExtensions = true;
    form.encoding = 'utf-8';

    form.parse(req, (err, fields, files) => {
        if (err) {
            req.session.flash = err;
            res.redirect('/auth/regist');
            return;
        }

        var fileName = Date.now() + '_' + fields.account + '.' + mime.extension(files.thumbnail.type);
        fs.rename(files.thumbnail.path, config.uploadDir + fileName, err => {
            if (err) {
                req.session.flash = err;
                res.redirect('/auth/regist');
                return;
            }

            service.regist({
                account: fields.account,
                password: fields.password,
                nickname: fields.nickname,
                thumbnail: config.address + config.photoDir + fileName
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
        });
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