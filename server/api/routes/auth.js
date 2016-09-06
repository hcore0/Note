var express = require('express');
var router = express.Router();
var noteCtrl = require('../controllers/noteController');
var authCtrl = require('../controllers/authController');

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

//获取个人信息
router.get('/user', authCtrl.getUser);
router.put('/user', authCtrl.editUser);

//附件上传
router.post('/upload', authCtrl.fileUpLoad);

module.exports = router;