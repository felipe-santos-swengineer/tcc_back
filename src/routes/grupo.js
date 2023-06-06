module.exports = function (app) {

    app.post('/criarGrupo', function (req, res) {
        app.src.controllers.grupo.criarGrupo(app, req, res);
    });

    app.post('/getGrupos', function (req, res) {
        app.src.controllers.grupo.getGrupo(app, req, res);
    });

}