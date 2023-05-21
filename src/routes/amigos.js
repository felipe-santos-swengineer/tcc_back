module.exports = function (app) {

    app.post('/amigos', function (req, res) {
        app.src.controllers.amigos.amigos(app, req, res);
    });

    app.post('/naoAmigos', function (req, res) {
        app.src.controllers.amigos.naoAmigos(app, req, res);
    });

    app.post('/adicionarAmigos', function (req, res) {
        app.src.controllers.amigos.adicionar(app, req, res);
    });

    app.post('/getSolicitacoes', function (req, res) {
        app.src.controllers.amigos.getSolicitacoes(app, req, res);
    });

}