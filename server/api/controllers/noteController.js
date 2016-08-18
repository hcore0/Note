var service = require('../../services/noteService');

exports.getNoteList = function (req, res, next) {
    var pageSize = 10;
    var index = +req.query.page || 1;

    service.getNoteList(pageSize, index)
        .then(data => {
            res.json(data);
        }, err => {
            next(err);
        });
};
    
exports.getNote = function (req, res, next) {
    service.getNote(req.params.id)
        .then(note => {
            res.json(note);
        }, err => {
            next(err);
        });
};

exports.addNote = function (req, res, next) {
    service.addNoteHandler({
        title: req.body.title,
        author: req.session.user.nickname,
        authorId: req.session.user._id,
        content: req.body.content,
    }).then(note => {
        res.status(201);
        res.json(note);
    }, err => {
        next(err);
    });
};

exports.editNote = function (req, res, next) {
    service.editNoteHandler({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content
    }).then(note => {
        res.json(note);
    }, err => {
        next(err);
    });
};

exports.like = function (req, res, next) {
    service.like(req.params.id)
        .then(note => {
            res.json(note);
        }, err => {
            next(err);
        });
};

exports.removeNote = function (req, res, next) {
    service.removeNote(req.params.id)
        .then(() => {
            res.status(204);
            res.json(null);
        }, err => {
            next(err);
        });
};
