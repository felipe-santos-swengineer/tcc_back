module.exports = function (app) {
    app.get('/', function (req, res) {
        app.src.controllers.home.home(app, req, res);
    });
}