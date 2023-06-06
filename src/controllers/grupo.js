module.exports.criarGrupo = function (app, req, res) {

    var model = new app.src.models.grupo();
    model.criarGrupo(req, res)

}

module.exports.getGrupo = function (app, req, res) {

    var model = new app.src.models.grupo();
    model.getGrupo(req, res)

}
