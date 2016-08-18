var mongoose = require('mongoose');

/**
 * 笔记
 * @type {Schema}
 */
var noteSchema = new mongoose.Schema({
    title: {type: String, required: true}, //标题
    createOn: Date,                        //创建日期
    author: String,                        //作者昵称
    authorId:String,                       //作者id
    content: String,                       //内容
    like: Number                           //点赞
});

mongoose.model('Note', noteSchema);
