module.exports.perfil = function (app, req, res) {

    var perfilModel = new app.src.models.perfil();

    perfilModel.getMyPerfil(req, res)

}

module.exports.updatePerfil = function (app, req, res) {

    var perfilModel = new app.src.models.perfil();

    perfilModel.updatePerfil(req, res)

}

module.exports.getPerfilById = function (app, req, res) {

    var perfilModel = new app.src.models.perfil();

    perfilModel.getPerfilById(req, res)

}