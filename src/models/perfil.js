const pool = require("../../config/db");

function perfil() { }

perfil.prototype.getMyPerfil = async function (req, res) {
    try {

        var usertoken = req.body.usertoken;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        const test = await pool.query("SELECT * from perfis where usertoken = $1", [
            usertoken
        ]);

        //idade
        var data = query.rows[0].data_nascimento.split('/')
        var idade = +new Date(data[2], data[1] - 1, data[0]);
        idade = ~~((Date.now() - idade) / (31557600000));

        if (test.rowCount > 0) {
            res.json([{ nome: query.rows[0].nome, cidade: test.rows[0].cidade, tipo: query.rows[0].tipo, sobre: test.rows[0].sobre, tags: test.rows[0].tags, idade: idade }]);
            return;
        }
        else {
            //criacao do perfil

            const test2 = await pool.query("INSERT INTO perfis(usertoken, tags, sobre, cidade) VALUES($1,$2,$3,$4)", [
                usertoken, "Novato", "Esse usuário ainda não cadastrou um resumo", "Sem cidade cadastrada"
            ]);

            const test3 = await pool.query("SELECT * from perfis where usertoken = $1", [
                usertoken
            ]);

            res.json([{ nome: query.rows[0].nome, cidade: test3.rows[0].cidade, tipo: query.rows[0].tipo, sobre: test3.rows[0].sobre, tags: test3.rows[0].tags, idade: idade }]);
            return;
        }

    }
    catch (err) {
        console.log(err)
    }
}

perfil.prototype.updatePerfil = async function (req, res) {
    try {

        var body = req.body
        var usertoken = body.usertoken;


        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        const test = await pool.query("UPDATE usuarios SET nome = $1 WHERE usertoken = $2", [
            body.nome, usertoken
        ]);

        const test1 = await pool.query("UPDATE perfis SET tags = $1, cidade = $2, sobre = $3 WHERE usertoken = $4", [
             body.tags, body.cidade, body.sobre ,usertoken
        ]);

        res.json([{msg: "Alteração realizada!"}])

    }
    catch (err) {
        console.log(err)
    }
}


perfil.prototype.getPerfilById = async function (req, res) {
    try {

        var usertoken = req.body.usertoken;
        var id = req.body.id

        const vld = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (vld.rowCount < 1) {
            res.json([])
            return;
        }

        const query = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
            id
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        const test = await pool.query("SELECT * from perfis where usertoken = $1", [
            query.rows[0].usertoken
        ]);

        //idade
        var data = query.rows[0].data_nascimento.split('/')
        var idade = +new Date(data[2], data[1] - 1, data[0]);
        idade = ~~((Date.now() - idade) / (31557600000));

        if (test.rowCount > 0) {
            res.json([{ nome: query.rows[0].nome, cidade: test.rows[0].cidade, tipo: query.rows[0].tipo, sobre: test.rows[0].sobre, tags: test.rows[0].tags, idade: idade }]);
            return;
        }
        else {
            //criacao do perfil

            const test2 = await pool.query("INSERT INTO perfis(usertoken, tags, sobre, cidade) VALUES($1,$2,$3,$4)", [
                query.rows[0].usertoken, "Novato", "Esse usuário ainda não cadastrou um resumo", "Sem cidade cadastrada"
            ]);

            const test3 = await pool.query("SELECT * from perfis where usertoken = $1", [
                query.rows[0].usertoken
            ]);

            res.json([{ nome: query.rows[0].nome, cidade: test3.rows[0].cidade, tipo: query.rows[0].tipo, sobre: test3.rows[0].sobre, tags: test3.rows[0].tags, idade: idade }]);
            return;
        }

    }
    catch (err) {
        console.log(err)
    }
}

module.exports = function () {
    return perfil;
}