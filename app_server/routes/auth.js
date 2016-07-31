var express = require('express');
var router = express.Router();
var noteCtrl = require('../controllers/noteController');

//查看
router.get('/note/list', noteCtrl.getNoteList);
router.get('/note/view/:id', noteCtrl.getNote);

//新增
router.get('/note/edit', noteCtrl.addNote);
router.post('/note/edit', noteCtrl.addNoteHandler);

//编辑
router.get('/note/edit/:id', noteCtrl.editNote);
router.post('/note/edit/:id', noteCtrl.editNoteHandler);
router.post('/note/edit/:id/like', noteCtrl.like);

//删除
router.post('/note/remove/:id', noteCtrl.removeNote);


router.get('/mine', function (req, res) {
    res.render('mine');
});

module.exports = router;