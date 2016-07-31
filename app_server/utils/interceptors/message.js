module.exports = function (req, res, next) {
    //将session的数据放入locals, 让handlebars可以访问
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    res.locals.currentUser = req.session.user;
    next();
};