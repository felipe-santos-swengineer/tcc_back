module.exports.inserir = function (app, req, res) {

    var fotoModel = new app.src.models.foto();

    fotoModel.inserir(req, res)

}

module.exports.getByToken = function (app, req, res) {

    var fotoModel = new app.src.models.foto();

    fotoModel.getByToken(req, res)

}

module.exports.getById = function (app, req, res) {

    var fotoModel = new app.src.models.foto();

    fotoModel.getById(req, res)

}