module.exports.email = function (app, req, res) {

    var emailModel = new app.src.models.email();

    emailModel.sendEmail(req, res)

}
