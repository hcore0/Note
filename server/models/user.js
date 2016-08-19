var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

/**
 * 用户
 * @type {Schema}
 */
var UserSchema = new mongoose.Schema({
    account: {type: String, unique: true, required: true}, //账号
    hashed_password: {type: String, unique: true, required: true},                                                  //密码
    nickname: {type: String, unique: true, required: true},                                                  //昵称
    createOn: Date,                                         //创建日期
    thumbnail: String
});

UserSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        account: this.account,
        nickname: this.nickname,
        exp: parseInt(expiry.getTime() / 1000, 10)
    }, process.env.JWT_SECRET);
};

var User = mongoose.model('User', UserSchema);