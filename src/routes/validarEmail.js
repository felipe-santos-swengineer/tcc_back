module.exports = function (app) {
    app.post('/validar-email', function (req, res) {
        app.src.controllers.validarEmail.validarEmail(app, req, res);
    });
    app.post('/solicitar-validacao-email', function (req, res) {
        app.src.controllers.validarEmail.solicitarValidacao(app, req, res);
    });
}