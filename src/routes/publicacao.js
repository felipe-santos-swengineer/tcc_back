module.exports = function (app) {

    app.post('/criarPublicacao', function (req, res) {
        app.src.controllers.publicacao.criar(app, req, res);
    });

    app.post('/getPublicacao', function (req, res) {
        app.src.controllers.publicacao.get(app, req, res);
    });

    app.post('/updatePublicacao', function (req, res) {
        app.src.controllers.publicacao.update(app, req, res);
    });

    app.post('/deletePublicacao', function (req, res) {
        app.src.controllers.publicacao.delete(app, req, res);
    });

    app.post('/deleteModeracao', function (req, res) {
        app.src.controllers.publicacao.deleteModeracao(app, req, res);
    });

    app.post('/getByIdPub', function (req, res) {
        app.src.controllers.publicacao.getById(app, req, res);
    });

    app.post('/getByIdPub2', function (req, res) {
        app.src.controllers.publicacao.getById2(app, req, res);
    });

    app.post('/getByPubSearch', function (req, res) {
        app.src.controllers.publicacao.getByPubSearch(app, req, res);
    });

    app.post('/inserirLike', function (req, res) {
        app.src.controllers.publicacao.inserirLike(app, req, res);
    });

    app.post('/comentar', function (req, res) {
        app.src.controllers.publicacao.comentar(app, req, res);
    });

}