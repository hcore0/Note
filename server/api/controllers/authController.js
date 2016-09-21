var service = require('../../services/authService');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var config = require('../../config');

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
        res.json({
            token: user.generateJwt()
        });
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


exports.getUser = function (req, res) {
    service.getUser({_id: req.user._id}).then(user => {
        res.json({
            nickname: user.nickname,
            thumbnail: user.thumbnail
        });
    }, err => {
        res.status(404);
        res.json(err);
    });
};

exports.editUser = function (req, res) {
    service.editUserHandler({
        id: req.user._id,
        nickname: req.body.nickname,
        thumbnail: req.body.thumbnail,
    }).then(user => {
        res.json({
            msg: '保存成功'
        });
    }, err => {
        res.status(400);
        res.json({
            msg: err
        });
    });
};

exports.fileUpLoad = function (req, res) {
    var form = new formidable.IncomingForm();

    form.uploadDir = config.uploadTempDir;
    form.keepExtensions = true;
    form.encoding = 'utf-8';

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(400);
            res.json(err);
            return;
        }

        var fileName = Date.now() + '_' + req.user._id + '.' + mime.extension(files.uploadFile.type);

        fs.rename(files.uploadFile.path, config.uploadDir + fileName, err => {
            if (err) {
                res.status(400);
                res.json(err);
                return;
            }

            res.json({url: config.address + config.photoDir + fileName});
        });
    });
};