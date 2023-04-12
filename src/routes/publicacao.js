module.exports = function (app) {

    app.post('/criarPublicacao', function (req, res) {
        app.src.controllers.publicacao.criar(app, req, res);
    });

    app.post('/getPublicacao', function (req, res) {
        app.src.controllers.publicacao.get(app, req, res);
    });

    app.post('/inserirLike', function (req, res) {
        app.src.controllers.publicacao.inserirLike(app, req, res);
    });

    app.post('/comentar', function (req, res) {
        app.src.controllers.publicacao.comentar(app, req, res);
    });

}