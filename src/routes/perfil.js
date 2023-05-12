module.exports = function (app) {

    app.post('/perfil', function (req, res) {
        app.src.controllers.perfil.perfil(app, req, res);
    });

    app.post('/updatePerfil', function (req, res) {
        app.src.controllers.perfil.updatePerfil(app, req, res);
    });

    app.post('/getPerfilById', function (req, res) {
        app.src.controllers.perfil.getPerfilById(app, req, res);
    });

}