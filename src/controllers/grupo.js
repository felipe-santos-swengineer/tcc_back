module.exports.criarGrupo = function (app, req, res) {

    var model = new app.src.models.grupo();
    model.criarGrupo(req, res)

}

module.exports.getGrupo = function (app, req, res) {

    var model = new app.src.models.grupo();
    model.getGrupo(req, res)

}

module.exports.getGrupoById = function (app, req, res) {

    var model = new app.src.models.grupo();
    model.getGrupoById(req, res)

}

module.exports.getMensagensGrupo = function (app, req, res) {

    var model = new app.src.models.grupo();
    model.getMensagensGrupo(req, res)

}

module.exports.setMensagensGrupo = function (app, req, res) {

    var model = new app.src.models.grupo();
    model.setMensagensGrupo(req, res)

}
