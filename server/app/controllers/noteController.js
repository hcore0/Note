var service = require('../../services/noteService');

exports.getNoteList = function (req, res, next) {
    var pageSize = 10;
    var index = +req.query.page || 1;

    service.getNoteList(pageSize, index)
        .then(data => {
            res.render('note/list', {
                list: data.list,
                total: data.total,
                current: index
            });
        }, err => {
            next(err);
        });
};
    
exports.getNote = function (req, res, next) {
    service.getNote(req.params.id)
        .then(note => {
            res.render('note/view', {
                note: note
            });
        }, err => {
            next(err);
        });
};

exports.addNote = function (req, res) {
    res.render('note/new');
};

exports.addNoteHandler = function (req, res, next) {
    service.addNoteHandler({
        title: req.body.title,
        author: req.session.user.nickname,
        authorId: req.session.user._id,
        content: req.body.content,
    }).then(() => {
        req.session.flash = {
            type: 'success',
            message: '发布成功!'
        };
        res.redirect('/note/list');
    }, err => {
        next(err);
    });
};

exports.editNote = function (req, res, next) {
    service.editNote(req.params.id)
        .then(note => {
            res.render('note/edit', {
                note: note
            });
        }, err => {
            next(err);
        });
};

exports.editNoteHandler = function (req, res, next) {
    service.editNoteHandler({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content
    }).then(() => {
        req.session.flash = {
            type: 'success',
            message: '发布成功!'
        };
        res.redirect('/note/list');
    }, err => {
        next(err);
    });
};

exports.removeNote = function (req, res, next) {
    service.removeNote(req.params.id)
        .then(() => {
            req.session.flash = {
                type: 'success',
                message: '删除成功!'
            };
            res.redirect('/note/list');
        }, err => {
            next(err);
        });
};

exports.like = function (req, res, next) {
    service.like(req.params.id)
        .then(() => {
            res.redirect('/note/view/' + req.params.id);
        }, err => {
            next(err);
        });
};
