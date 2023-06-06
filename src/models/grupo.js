const pool = require("../../config/db");
require("dotenv").config();

function grupo() { }

grupo.prototype.criarGrupo = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var titulo = body.titulo;
        var membros = body.membros;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json("Usuário Invalido!")
            return;
        }

        membros.push(query.rows[0].id)

        if (titulo.length > 0 && membros.length > 1) {
            const createGp = await pool.query("INSERT INTO grupo(titulo, criador_id) VALUES ($1, $2)", [
                titulo, query.rows[0].id
            ]);
            const getGpId = await pool.query("SELECT MAX(id) as id FROM grupo where criador_id = $1", [
                query.rows[0].id
            ]);
            //remember to validade friendship
            for (var i = 0; i < membros.length; i++) {
                var insertMembros = await pool.query("INSERT INTO membros_grupo(id_grupo, id_membro) VALUES ($1, $2)", [
                    getGpId.rows[0].id, membros[i]
                ]);
            }

            res.json("Grupo Inserido!")
            return;

        }

        res.json("Houve uma falha!");
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

grupo.prototype.getGrupo = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json("Usuário Invalido!")
            return;
        }

        var getGp = await pool.query("select grupo.id as id, grupo.titulo as titulo from grupo inner join membros_grupo on id_membro = $1 group by grupo.id", [
            query.rows[0].id
        ]);

        if (getGp.rowCount > 0) {
            for (var i = 0; i < getGp.rowCount; i++) {
                var getParticipantes = await pool.query("select nome, usuarios.id from usuarios inner join membros_grupo on membros_grupo.id_membro = usuarios.id where membros_grupo.id_grupo = $1 and membros_grupo.id_membro != $2", [
                    getGp.rows[i].id,  query.rows[0].id
                ]);
                getGp.rows[i]['participantes'] = getParticipantes.rows
            }
            res.json(getGp.rows)
            return
        }

        res.json([])
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}


module.exports = function () {
    return grupo;
}