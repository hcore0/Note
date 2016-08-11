var mongoose = require('mongoose');

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

var User = mongoose.model('User', UserSchema);