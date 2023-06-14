module.exports.criarChatPrivado = function (app, req, res) {

    var model = new app.src.models.chatPrivado();
    model.criarChatPrivado(req, res)

}

module.exports.getChatPrivado = function (app, req, res) {

    var model = new app.src.models.chatPrivado();
    model.getChatPrivado(req, res)

}

module.exports.getChatPrivadoById = function (app, req, res) {

    var model = new app.src.models.chatPrivado();
    model.getChatPrivadoById(req, res)

}

module.exports.setMensagensPrivado = function (app, req, res) {

    var model = new app.src.models.chatPrivado();
    model.setMensagensPrivado(req, res)

}

module.exports.getMensagensPrivado = function (app, req, res) {

    var model = new app.src.models.chatPrivado();
    model.getMensagensPrivado(req, res)

}