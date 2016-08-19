module.exports = function (app) {
    //不需要登陆
    app.use('/', require('./free'));

    //需要登陆
    app.use('/', require('../interceptors/authentication'), require('./auth'));
};