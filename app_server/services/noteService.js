/*
笔记与数据库的交互服务
 */
var mongoose = require('mongoose'),
    Note = mongoose.model('Note');

exports.getNoteList = function (pageSize, page) {
    var promise = new Promise((resolve, reject) => {
        Note.count({}, (err, count) => {
            if (count > 0) {
                Note.find({}, null, {skip: pageSize *  (page - 1), limit: pageSize, sort: {'createOn': -1}}, (err, list) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            list: list,
                            total: Math.ceil(count / pageSize)
                        });
                    }
                });
            } else {
                resolve({
                    list: [],
                    total: 0
                });
            }
        });
    });
    
    return promise;
};

exports.getNote = function (id) {
    var promise = new Promise((resolve, reject) => {
        Note.findOne({_id: id}).exec((err, note) => {
            if (err) {
                reject(err);
            } else {
                resolve(note);
            }
        });
    });

    return promise;
};

exports.addNoteHandler = function (data) {
    var note = new Note({
        title: data.title,
        createOn: new Date(),
        author: data.author,
        authorId: data.authorId,
        content: data.content,
        like: 0
    });

    var promise = new Promise((resolve, reject) => {
        note.save(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    return promise;
};

exports.editNote = function (id) {
    var promise = new Promise((resolve, reject) => {
        Note.findOne({_id: id}).exec((err, note) => {
            if (err) {
                reject(err);
            } else {
                resolve(note);
            }
        });
    });

    return promise;
};

exports.editNoteHandler = function (data) {
    var promise = new Promise((resolve, reject) => {
        Note.update(
            {_id: data.id},
            {$set: {
                title: data.title,
                content: data.content
            }},
            {upsert: true})
        .exec(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
    
    return promise;
};

exports.removeNote = function (id) {
    var promise = new Promise((resolve, reject) => {
        Note.remove({_id: id}).exec(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    return promise;
};

exports.like = function (id) {
    var promise = new Promise((resolve, reject) => {
        Note.findOne({_id: id}).exec((err, note) => {
            if (err) {
                reject(err);
            } else {
                Note.update(
                    {_id: id},
                    {$set: {
                        like: ++note.like
                    }},
                    {upsert: true})
                .exec(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });

    return promise;
};