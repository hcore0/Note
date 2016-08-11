var express = require('express');
var router = express.Router();
var noteCtrl = require('../controllers/noteController');

//查看
router.get('/api/note', noteCtrl.getNoteList);
router.get('/api/note/:id', noteCtrl.getNote);

//新增
router.post('/api/note', noteCtrl.addNote);

//编辑
router.put('/api/note/:id', noteCtrl.editNote);
router.put('/api/note/:id/like', noteCtrl.like);

//删除
router.delete('/api/note/:id', noteCtrl.removeNote);

module.exports = router;