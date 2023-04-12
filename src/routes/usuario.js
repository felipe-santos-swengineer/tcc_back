const passport = require('passport');
require("dotenv").config();

module.exports = function (app) {

    app.post('/login', function (req, res) {
        app.src.controllers.usuarios.login(app, req, res);
    });
    app.post('/usuarios', function (req, res) {
        app.src.controllers.usuarios.inserir(app, req, res);
    });
    app.post('/usuarios-byToken', function (req, res) {
        app.src.controllers.usuarios.getByToken(app, req, res);
    });
    app.post('/update-usuario', function (req, res) {
        app.src.controllers.usuarios.update(app, req, res);
    });
}