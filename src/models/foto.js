const pool = require("../../config/db");

function foto() { }

foto.prototype.inserir = async function (req, res) {

    try {
        var body = req.body;
        var usertoken = body.usertoken;
        var img = body.img;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json("Usuario inválido")
            return;
        }

        const query1 = await pool.query("DELETE FROM foto_perfil WHERE usertoken = $1", [
            usertoken
        ]);

        const query2 = await pool.query("INSERT INTO foto_perfil (user_id, usertoken, img_json) VALUES ($1,$2,$3)", [
            query.rows[0].id, usertoken, { img }
        ]);

        res.json("Foto inserida");
        return


    }
    catch (err) {
        console.log(err);
        res.json(err)
        return;
    }

}

foto.prototype.getByToken = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var id = body.id;
        //validação

        if (usertoken) {
            const query = await pool.query("SELECT id, img_json FROM foto_perfil WHERE usertoken = $1", [
                usertoken
            ]);

            if (query.rowCount > 0) {
                res.json([query.rows[0]]);
                return;
            }
            else {
                res.json([]);
                return;
            }
        }
        else if (id) {
            const query = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
                id
            ]);

            if (query.rowCount > 0) {
                res.json([query.rows[0]]);
                return;
            }
            else {
                res.json([]);
                return;
            }
        }

        res.json('');
        return


    }
    catch (err) {
        console.log(err);
        res.json(err)
    }
}


foto.prototype.getById = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var id = body.id;
        //validação

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json("Usuario inválido")
            return;
        }

        const query1 = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
            id
        ]);

        if (query1.rowCount < 1) {
            res.json([]);
            return;
        }
        else {
            res.json([query1.rows[0]]);
            return;
        }


        res.json('');
        return


    }
    catch (err) {
        console.log(err);
        res.json(err)
    }
}

module.exports = function () {
    return foto;
}