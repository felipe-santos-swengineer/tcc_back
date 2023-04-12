module.exports.validarEmail = function (app, req, res) {

    var validarEmailModel = new app.src.models.validarEmail();

    validarEmailModel.validar(req, res)

}

module.exports.solicitarValidacao = function (app, req, res) {

    var validarEmailModel = new app.src.models.validarEmail();

    validarEmailModel.solicitarValidacao(req, res)

}