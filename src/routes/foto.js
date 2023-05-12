module.exports = function (app) {
    app.post('/foto', function (req, res) {
        app.src.controllers.foto.inserir(app, req, res);
    });
    app.post('/foto-byToken', function (req, res) {
        app.src.controllers.foto.getByToken(app, req, res);
    });
    app.post('/foto-byId', function (req, res) {
        app.src.controllers.foto.getById(app, req, res);
    });
}