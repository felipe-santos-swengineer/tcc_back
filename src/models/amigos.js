const pool = require("../../config/db");
require("dotenv").config();

function amigos() { }


amigos.prototype.naoAmigos = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken != $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        const query_ = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query_.rowCount < 1) {
            res.json([])
            return;
        }


        var query1;
        var query2;
        var naoAmigos = [];

        for (var i = 0; i < query.rowCount; i++) {
            query1 = await pool.query("SELECT * FROM amigos WHERE pessoa_id = $1", [
                query.rows[i].id
            ]);

            //verificar se ja são amigos
            const query2 = await pool.query("SELECT * FROM solicitacao_amigo WHERE de_id = $1 AND para_id = $2", [
                query_.rows[0].id, query.rows[i].id
            ]);

            if (query1.rowCount < 1 && query2.rowCount < 1) {
                naoAmigos.push({ nome: query.rows[i].nome, id: query.rows[i].id })
            }
        }

        res.json(naoAmigos);
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

amigos.prototype.amigos = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken != $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var query1;
        var amigos = [];

        for (var i = 0; i < query.rowCount; i++) {
            query1 = await pool.query("SELECT * FROM amigos WHERE pessoa_id = $1", [
                query.rows[i].id
            ]);

            if (query1.rowCount > 0) {
                amigos.push({ nome: query.rows[i].nome, id: query.rows[i].id })
            }
        }

        res.json(amigos);
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

amigos.prototype.solicitacoes = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var solicitacoes = [];

        const query1 = await pool.query("SELECT * FROM solicitacao_amigo WHERE pessoa_id = $1 or pessoa1_id", [
            query.rows[i].id
        ]);

        if (query1.rowCount > 0) {
            solicitacoes.push({ nome: query.rows[i].nome, id: query.rows[i].id })
        }

        res.json(solicitacoes);
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

amigos.prototype.adicionar = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var to_id = body.to_id;

        console.log(usertoken + " " + to_id)
        console.log(typeof usertoken + " " + typeof to_id)

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json("Usuário Invalido!")
            return;
        }

        const query_ = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
            to_id
        ]);

        if (query_.rowCount < 1) {
            res.json("Usuário Invalido!")
            return;
        }

        //verificar se ja são amigos
        const query1 = await pool.query("SELECT * FROM amigos WHERE pessoa_id = $1 AND pessoa1_id = $2", [
            query.rows[0].id, to_id
        ]);

        if (query1.rowCount > 0) {
            res.json("Já são amigos")
            return;
        }

        //verificar se ja existe solicitacao de mim para ele
        const query2 = await pool.query("SELECT * FROM solicitacao_amigo WHERE de_id = $1 AND para_id = $2", [
            query.rows[0].id, to_id
        ]);

        if (query2.rowCount > 0) {
            res.json("Aguardando confirmação do destinatário")
            return;
        }

        //verificar se ja existe solicitacao dele para mim
        const query3 = await pool.query("SELECT * FROM solicitacao_amigo WHERE de_id = $1 AND para_id = $2", [
            to_id, query.rows[0].id
        ]);

        if (query3.rowCount > 0) { //aceitar amizade
            //deleta solicitacoes
            var query4 = await pool.query("DELETE FROM solicitacao_amigo WHERE de_id = $1 AND para_id = $2", [
                to_id, query.rows[0].id
            ]);
            var query5 = await pool.query("DELETE FROM solicitacao_amigo WHERE de_id = $1 AND para_id = $2", [
                query.rows[0].id, to_id
            ]);
            var query6 = await pool.query("INSERT INTO amigos(pessoa_id, pessoa1_id) VALUES ($1, $2)", [
                query.rows[0].id, to_id
            ]);
            var query7 = await pool.query("INSERT INTO amigos(pessoa_id, pessoa1_id) VALUES ($1, $2)", [
                to_id, query.rows[0].id
            ]);
            res.json("Amizade aceita")
            return;
        }

        //cria solicitacao
        var query8 = await pool.query("INSERT INTO solicitacao_amigo(de_id, para_id) VALUES ($1, $2)", [
            query.rows[0].id, to_id
        ]);

        res.json("Solicitado!");
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

module.exports = function () {
    return amigos;
}