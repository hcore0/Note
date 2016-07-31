var crypto = require('crypto');
var mongoose = require('mongoose'),
    User = mongoose.model('User');

//密码加密
function hashPW (pwd) {
    return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

exports.regist = function (data) {
    var user = new User({
        account: data.account,
        hashed_password: hashPW(data.password),
        nickname: data.nickname,
        createOn: new Date()
    });

    var promise = new Promise((resolve, reject) => {
        user.save(err => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });

    return promise;
};

exports.login = function (data) {
    var promise = new Promise((resolve, reject) => {
        User.findOne({account: data.account})
            .exec((err, user) => {
                if (!user) {
                   reject('没有该用户!');
                } else if (user.hashed_password === hashPW(data.password.toString())) {
                    resolve(user);
                }  else {
                    reject('账号或密码错误!');
                }
            });
    });
    return promise;
};