module.exports.criar = function (app, req, res) {

    var publicacaoModel = new app.src.models.publicacao();

    publicacaoModel.criar(req, res)

}

module.exports.get = function (app, req, res) {

    var publicacaoModel = new app.src.models.publicacao();

    publicacaoModel.get(req, res)

}

module.exports.update = function (app, req, res) {

    var publicacaoModel = new app.src.models.publicacao();

    publicacaoModel.update(req, res)

}

module.exports.delete = function (app, req, res) {

    var publicacaoModel = new app.src.models.publicacao();

    publicacaoModel.delete(req, res)

}

module.exports.deleteModeracao = function (app, req, res) {

    var publicacaoModel = new app.src.models.publicacao();

    publicacaoModel.deleteModeracao(req, res)

}

module.exports.getById = function (app, req, res) {

    var publicacaoModel = new app.src.models.publicacao();

    publicacaoModel.getById(req, res)

}

module.exports.getById2 = function (app, req, res) {

    var publicacaoModel = new app.src.models.publicacao();

    publicacaoModel.getById2(req, res)
}

module.exports.getByPubSearch = function (app, req, res) {

    var publicacaoModel = new app.src.models.publicacao();

    publicacaoModel.getByPubSearch(req, res)
}


module.exports.inserirLike = function (app, req, res) {

    var publicacaoModel = new app.src.models.publicacao();

    publicacaoModel.inserirLike(req, res)

}

module.exports.comentar = function (app, req, res) {

    var publicacaoModel = new app.src.models.publicacao();

    publicacaoModel.comentar(req, res)

}