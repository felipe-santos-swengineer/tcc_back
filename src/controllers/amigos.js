module.exports.amigos = function (app, req, res) {

    var model = new app.src.models.amigos();

    model.amigos(req, res)

}

module.exports.naoAmigos = function (app, req, res) {

    var model = new app.src.models.amigos();

    model.naoAmigos(req, res)

}

module.exports.amigosComum = function (app, req, res) {

    var model = new app.src.models.amigos();

    model.amigosComum(req, res)

}

module.exports.naoAmigosComum = function (app, req, res) {

    var model = new app.src.models.amigos();

    model.naoAmigosComum(req, res)

}

module.exports.adicionar = function (app, req, res) {

    var model = new app.src.models.amigos();

    model.adicionar(req, res)

}

module.exports.remover = function (app, req, res) {

    var model = new app.src.models.amigos();

    model.remover(req, res)

}

module.exports.getSolicitacoes = function (app, req, res) {

    var model = new app.src.models.amigos();

    model.getSolicitacoes(req, res)

}