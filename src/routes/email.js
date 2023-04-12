module.exports = function (app) {
    app.post('/email', function (req, res) {
        app.src.controllers.email.email(app, req, res);
    });
}