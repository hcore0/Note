module.exports = function (app) {
    //不需要token
    app.use('/', require('./free'));

    //需要token
    app.use('/', require('../interceptors/jwt'), require('./auth'));
};