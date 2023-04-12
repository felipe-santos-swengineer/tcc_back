module.exports.home = function (app, req, res) {

    var homeModel = new app.src.models.home();

    homeModel.testBD(req, res)

}
