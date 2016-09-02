module.exports = function (app) {
    //CORS
    app.use('/', function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    });
    app.options('/*', function (req, res) {
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.end();
    });

    //不需要token
    app.use('/', require('./free'));

    //需要token
    app.use('/', require('../interceptors/jwt'), require('./auth'));
};