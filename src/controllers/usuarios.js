module.exports.inserir = function (app, req, res) {

    var usuariosModel = new app.src.models.usuarios();

    usuariosModel.inserir(req, res)

}

module.exports.getByToken = function (app, req, res) {

    var usuariosModel = new app.src.models.usuarios();

    usuariosModel.getByToken(req, res)

}

module.exports.update = function (app, req, res) {

    var usuariosModel = new app.src.models.usuarios();

    usuariosModel.update(req, res)

}

module.exports.login = function (app, req, res) {

    var usuariosModel = new app.src.models.usuarios();

    usuariosModel.login(req, res)

}
