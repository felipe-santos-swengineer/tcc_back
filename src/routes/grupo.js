module.exports = function (app) {

    app.post('/criarGrupo', function (req, res) {
        app.src.controllers.grupo.criarGrupo(app, req, res);
    });

    app.post('/getGrupos', function (req, res) {
        app.src.controllers.grupo.getGrupo(app, req, res);
    });

    app.post('/getGrupoById', function (req, res) {
        app.src.controllers.grupo.getGrupoById(app, req, res);
    });

    app.post('/getMensagensGrupo', function (req, res) {
        app.src.controllers.grupo.getMensagensGrupo(app, req, res);
    });

    app.post('/setMensagensGrupo', function (req, res) {
        app.src.controllers.grupo.setMensagensGrupo(app, req, res);
    });

    app.post('/sairGrupo', function (req, res) {
        app.src.controllers.grupo.sairGrupo(app, req, res);
    });

}