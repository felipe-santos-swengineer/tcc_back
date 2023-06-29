module.exports = function (app) {

    app.post('/criarChatPrivado', function (req, res) {
        app.src.controllers.chatPrivado.criarChatPrivado(app, req, res);
    });

    app.post('/getChatPrivado', function (req, res) {
        app.src.controllers.chatPrivado.getChatPrivado(app, req, res);
    });

    app.post('/getChatPrivadoById', function (req, res) {
        app.src.controllers.chatPrivado.getChatPrivadoById(app, req, res);
    });

    app.post('/setMensagensPrivado', function (req, res) {
        app.src.controllers.chatPrivado.setMensagensPrivado(app, req, res);
    });

    app.post('/getMensagensPrivado', function (req, res) {
        app.src.controllers.chatPrivado.getMensagensPrivado(app, req, res);
    });

    app.post('/sairConversa', function (req, res) {
        app.src.controllers.chatPrivado.sairConversa(app, req, res);
    });
}