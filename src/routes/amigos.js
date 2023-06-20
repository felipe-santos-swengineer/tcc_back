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

    app.post('/removerAmigos', function (req, res) {
        app.src.controllers.amigos.remover(app, req, res);
    });

    app.post('/getSolicitacoes', function (req, res) {
        app.src.controllers.amigos.getSolicitacoes(app, req, res);
    });

    app.post('/amigosComum', function (req, res) {
        app.src.controllers.amigos.amigosComum(app, req, res);
    });

    app.post('/naoAmigosComum', function (req, res) {
        app.src.controllers.amigos.naoAmigosComum(app, req, res);
    });

}