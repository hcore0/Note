module.exports = function (req, res, next) {
    //拦截未登录用户的请求
    if (req.session) {
        if (req.session.user) {
            next();
        } else {
            req.session.flash = {
                type: 'danger',
                message: '请登录'
            };
            res.redirect('/');
        }
        
    } else {
        res.redirect('/');
    }
};