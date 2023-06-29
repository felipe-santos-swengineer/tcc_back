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

grupo.prototype.sairGrupo = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var grupo_id = body.id;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json("Usuário Invalido!")
            return;
        }

        const exitGp = await pool.query("DELETE FROM membros_grupo WHERE id_grupo = $1 AND id_membro = $2", [
            grupo_id, query.rows[0].id
        ]);

        res.json("Remoção de participação com sucesso!")
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

        var getGp = await pool.query("select grupo.id as id, grupo.titulo as titulo from grupo grupo inner join membros_grupo membros on membros.id_grupo = grupo.id where membros.id_membro = $1", [
            query.rows[0].id
        ]);

        if (getGp.rowCount > 0) {
            for (var i = 0; i < getGp.rowCount; i++) {
                var getParticipantes = await pool.query("select nome, usuarios.id from usuarios inner join membros_grupo on membros_grupo.id_membro = usuarios.id where membros_grupo.id_grupo = $1 and membros_grupo.id_membro != $2", [
                    getGp.rows[i].id, query.rows[0].id
                ]);

                var getMensagens = await pool.query("select * from mensagem_grupo where grupo_id = $1 ORDER BY data_criacao ASC", [
                    getGp.rows[i].id
                ]);

                getGp.rows[i]['participantes'] = getParticipantes.rows
                if (getMensagens.rowCount < 1) {
                    getGp.rows[i]['last_msg'] = ''
                    getGp.rows[i]['last_msg_autor'] = ''
                }
                else {
                    getGp.rows[i]['last_msg_autor'] = 'Você'
                    for (var j = 0; j < getParticipantes.rowCount; j++) {
                        if (getParticipantes.rows[j].id === getMensagens.rows[getMensagens.rowCount - 1].autor) {
                            getGp.rows[i]['last_msg_autor'] = getParticipantes.rows[j].nome
                        }
                    }
                    getGp.rows[i]['last_msg'] = getMensagens.rows[getMensagens.rowCount - 1].conteudo
                }

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


grupo.prototype.getGrupoById = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var grupo_id = body.grupo_id;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var getGp = await pool.query("select grupo.id as id, grupo.titulo as titulo from grupo grupo inner join membros_grupo membros on membros.id_grupo = grupo.id where membros.id_membro = $1 and grupo.id = $2", [
            query.rows[0].id, grupo_id
        ]);

        if (getGp.rowCount > 0) {
            for (var i = 0; i < getGp.rowCount; i++) {
                var getParticipantes = await pool.query("select nome, usuarios.id from usuarios inner join membros_grupo on membros_grupo.id_membro = usuarios.id where membros_grupo.id_grupo = $1 and membros_grupo.id_membro != $2", [
                    getGp.rows[i].id, query.rows[0].id
                ]);

                for (var j = 0; j < getParticipantes.rowCount; j++) {
                    var getFoto = await pool.query("select img_json from foto_perfil where user_id = $1", [
                        getParticipantes.rows[j].id
                    ]);
                    if (getFoto.rowCount > 0) {
                        getParticipantes.rows[j]['foto'] = getFoto.rows[0].img_json.img
                    }
                }

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

grupo.prototype.getMensagensGrupo = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var grupo_id = body.grupo_id;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var getGp = await pool.query("select grupo.id as id, grupo.titulo as titulo from grupo grupo inner join membros_grupo membros on membros.id_grupo = grupo.id where membros.id_membro = $1 and grupo.id = $2", [
            query.rows[0].id, grupo_id
        ]);

        if (getGp.rowCount > 0) {
            var getMensagens = await pool.query("select * from mensagem_grupo where grupo_id = $1 ORDER BY data_criacao ASC", [
                grupo_id
            ]);

            for (var i = 0; i < getMensagens.rowCount; i++) {
                var getFoto = await pool.query("select img_json from foto_perfil where user_id = $1", [
                    getMensagens.rows[i].autor
                ]);

                var getNome = await pool.query("select nome from usuarios where id = $1", [
                    getMensagens.rows[i].autor
                ]);

                if (getFoto.rowCount > 0) {
                    getMensagens.rows[i]['foto'] = getFoto.rows[0].img_json.img
                }

                getMensagens.rows[i]['nome'] = getNome.rows[0].nome

                if (getMensagens.rows[i].autor === query.rows[0].id) {
                    getMensagens.rows[i]['self'] = true
                }
                else {
                    getMensagens.rows[i]['self'] = false
                }

            }

            res.json(getMensagens.rows)
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

grupo.prototype.setMensagensGrupo = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var grupo_id = body.grupo_id;
        var mensagem = body.mensagem;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var getGp = await pool.query("select grupo.id as id, grupo.titulo as titulo from grupo grupo inner join membros_grupo membros on membros.id_grupo = grupo.id where membros.id_membro = $1 and grupo.id = $2", [
            query.rows[0].id, grupo_id
        ]);

        if (getGp.rowCount > 0) {
            var insertMsg = await pool.query("insert into mensagem_grupo (conteudo, autor, grupo_id) VALUES ($1, $2, $3)", [
                mensagem, query.rows[0].id, grupo_id
            ]);
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