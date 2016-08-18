var express = require('express');
var router = express.Router();
var noteCtrl = require('../controllers/noteController');

//查看
router.get('/note', noteCtrl.getNoteList);
router.get('/note/:id', noteCtrl.getNote);

//新增
router.post('/note', noteCtrl.addNote);

//编辑
router.put('/note/:id', noteCtrl.editNote);
router.put('/note/:id/like', noteCtrl.like);

//删除
router.delete('/note/:id', noteCtrl.removeNote);

module.exports = router;