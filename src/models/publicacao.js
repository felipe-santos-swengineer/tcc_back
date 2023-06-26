const pool = require("../../config/db");
require("dotenv").config();

function publicacao() { }

publicacao.prototype.criar = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var conteudo = body.conteudo;
        var noticia = body.noticia;
        console.log(body.noticia + "")

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);


        if (query.rowCount < 1) {
            res.json("Usuário inválido!")
            return;
        }

        if (noticia && query.rows[0].tipo !== 'Colaborador') {
            res.json("Usuário inválido!")
            return;
        }

        if (conteudo.length < 1) {
            res.json("Publicação vazia!")
            return;
        }

        const query2 = await pool.query("INSERT INTO publicacao(conteudo, usertoken, noticia) VALUES ($1, $2, $3)", [
            conteudo, usertoken, noticia
        ]);

        res.json("Publicação feita!");
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}


publicacao.prototype.get = async function (req, res) {
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

        //todos as amizades do usuario em questão
        var amigos = await pool.query("SELECT usu.usertoken as token FROM usuarios usu INNER JOIN amigos ami ON usu.id = ami.pessoa1_id WHERE pessoa_id = $1", [
            query.rows[0].id
        ]);

        var publicacoes = await pool.query("SELECT * FROM publicacao ORDER BY data_criacao DESC");

        var likes = await pool.query("SELECT * FROM likes WHERE usertoken = $1", [
            usertoken
        ]);

        var usuarios = await pool.query("SELECT * FROM usuarios", []);

        var publicacoesFeed = []

        for (var i = 0; i < publicacoes.rowCount; i++) {

            var id_publicador = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1 ORDER BY data_criacao", [
                publicacoes.rows[i].usertoken
            ]);


            //adiciona campo likes
            publicacoes.rows[i].curtiu = false
            for (var j = 0; j < likes.rowCount; j++) {
                if (likes.rows[j].id_pub == publicacoes.rows[i].id) {
                    publicacoes.rows[i].curtiu = true
                }
            }

            //adiciona campo criador
            for (var j = 0; j < usuarios.rowCount; j++) {
                if (usuarios.rows[j].usertoken == publicacoes.rows[i].usertoken) {
                    publicacoes.rows[i].nome = usuarios.rows[j].nome
                }
            }

            //adiciona campo comentarios
            var comentarios = await pool.query("SELECT * FROM comentarios WHERE id_pub = $1 ORDER BY data_criacao", [
                publicacoes.rows[i].id
            ]);

            var aComentarios = []

            for (var j = 0; j < comentarios.rowCount; j++) {
                var autor = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
                    comentarios.rows[j].usertoken
                ]);
                aComentarios.push({ nome: autor.rows[0].nome, id_autor: autor.rows[0].id, conteudo: comentarios.rows[j].conteudo, data_criacao: comentarios.rows[j].data_criacao })
            }

            publicacoes.rows[i].comentarios = aComentarios
            publicacoes.rows[i].openComentarios = false
            publicacoes.rows[i].id_publicador = id_publicador.rows[0].id
            if (id_publicador.rows[0].id === query.rows[0].id) {//se eu sou o dono da publicacao
                publicacoes.rows[i].owner = true
            }
            else {
                publicacoes.rows[i].owner = false
            }

            var fotos = await pool.query("SELECT id, img_json FROM foto_perfil WHERE usertoken = $1", [publicacoes.rows[i].usertoken]);
            if (fotos.rowCount > 0) {
                publicacoes.rows[i].img = fotos.rows[0].img_json.img
            }
            else {
                publicacoes.rows[i].img = null
            }

            var pubToken = publicacoes.rows[i].usertoken

            //deleta campo usertoken
            delete publicacoes.rows[i].usertoken

            if (!publicacoes.rows[i].noticia) { //se não é noticia, verifica se é de amigo
                for (var j = 0; j < amigos.rowCount; j++) {
                    if (amigos.rows[j].token === pubToken || pubToken === query.rows[0].usertoken) {
                        publicacoesFeed.push(publicacoes.rows[i])
                        break
                    }
                }
            }
            else {
                publicacoesFeed.push(publicacoes.rows[i])
            }

        }

        res.json(publicacoesFeed);
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}


publicacao.prototype.update = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var id = body.id;
        var conteudo = body.conteudo;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);


        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        if (conteudo.trim().length > 0) {
            var publicacoes = await pool.query("UPDATE publicacao SET conteudo = $1 WHERE id = $2 AND usertoken = $3", [
                conteudo, id, usertoken
            ]);
        }

        res.json([]);
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}


publicacao.prototype.delete = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var id = body.id;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var publicacoes = await pool.query("DELETE FROM publicacao WHERE id = $1 AND usertoken = $2", [
            id, usertoken
        ]);


        res.json([]);
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

publicacao.prototype.deleteModeracao = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var id = body.id;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        if (query.rows[0].tipo !== 'Colaborador') {
            res.json([])
            return;
        }

        var publicacoes = await pool.query("DELETE FROM publicacao WHERE id = $1", [
            id
        ]);


        res.json([]);
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

publicacao.prototype.getById = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var id = body.id;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var publicacoes = await pool.query("SELECT usuarios.id as user, usuarios.usertoken, usuarios.nome, publicacao.id, publicacao.conteudo, publicacao.visivel, publicacao.data_criacao FROM USUARIOS INNER JOIN publicacao ON publicacao.usertoken = usuarios.usertoken WHERE usuarios.id = $1 ORDER BY data_criacao DESC ", [id]);

        var likes = await pool.query("SELECT * FROM likes WHERE usertoken = $1", [
            usertoken
        ]);

        var usuarios = await pool.query("SELECT * FROM usuarios");

        for (var i = 0; i < publicacoes.rowCount; i++) {

            var id_publicador = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1 ORDER BY data_criacao", [
                publicacoes.rows[i].usertoken
            ]);

            //adiciona campo likes
            publicacoes.rows[i].curtiu = false
            for (var j = 0; j < likes.rowCount; j++) {
                if (likes.rows[j].id_pub == publicacoes.rows[i].id) {
                    publicacoes.rows[i].curtiu = true
                }
            }

            //adiciona campo criador
            for (var j = 0; j < usuarios.rowCount; j++) {
                if (usuarios.rows[j].usertoken == publicacoes.rows[i].usertoken) {
                    publicacoes.rows[i].nome = usuarios.rows[j].nome
                }
            }

            //adiciona campo comentarios
            var comentarios = await pool.query("SELECT * FROM comentarios WHERE id_pub = $1 ORDER BY data_criacao", [
                publicacoes.rows[i].id
            ]);

            var aComentarios = []

            for (var j = 0; j < comentarios.rowCount; j++) {
                var autor = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
                    comentarios.rows[j].usertoken
                ]);
                aComentarios.push({ id_autor: autor.rows[0].id, nome: autor.rows[0].nome, conteudo: comentarios.rows[j].conteudo, data_criacao: comentarios.rows[j].data_criacao })
            }

            publicacoes.rows[i].comentarios = aComentarios
            publicacoes.rows[i].openComentarios = false
            publicacoes.rows[i].id_publicador = id_publicador.rows[0].id
            if (id_publicador.rows[0].id === query.rows[0].id) {//se eu sou o dono da publicacao
                publicacoes.rows[i].owner = true
            }
            else {
                publicacoes.rows[i].owner = false
            }

            //deleta campo usertoken
            delete publicacoes.rows[i].usertoken

            var fotos = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [publicacoes.rows[i].user]);
            if (fotos.rowCount > 0) {
                publicacoes.rows[i].img = fotos.rows[0].img_json.img
            }
            else {
                publicacoes.rows[i].img = null
            }

        }

        res.json(publicacoes.rows);
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

publicacao.prototype.getById2 = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var id = body.id;
        console.log("estou aqui")

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var publicacoes = await pool.query("SELECT usuarios.id as user, usuarios.usertoken, usuarios.nome, publicacao.id, publicacao.conteudo, publicacao.visivel, publicacao.data_criacao FROM USUARIOS INNER JOIN publicacao ON publicacao.usertoken = usuarios.usertoken WHERE publicacao.id = $1  ORDER BY data_criacao DESC ", [id]);

        var likes = await pool.query("SELECT * FROM likes WHERE usertoken = $1", [
            usertoken
        ]);

        var usuarios = await pool.query("SELECT * FROM usuarios");

        for (var i = 0; i < publicacoes.rowCount; i++) {

            var id_publicador = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1 ORDER BY data_criacao", [
                publicacoes.rows[i].usertoken
            ]);

            //adiciona campo likes
            publicacoes.rows[i].curtiu = false
            for (var j = 0; j < likes.rowCount; j++) {
                if (likes.rows[j].id_pub == publicacoes.rows[i].id) {
                    publicacoes.rows[i].curtiu = true
                }
            }

            //adiciona campo criador
            for (var j = 0; j < usuarios.rowCount; j++) {
                if (usuarios.rows[j].usertoken == publicacoes.rows[i].usertoken) {
                    publicacoes.rows[i].nome = usuarios.rows[j].nome
                }
            }

            //adiciona campo comentarios
            var comentarios = await pool.query("SELECT * FROM comentarios WHERE id_pub = $1 ORDER BY data_criacao", [
                publicacoes.rows[i].id
            ]);

            var aComentarios = []

            for (var j = 0; j < comentarios.rowCount; j++) {
                var autor = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
                    comentarios.rows[j].usertoken
                ]);
                aComentarios.push({ id_autor: autor.rows[0].id, nome: autor.rows[0].nome, conteudo: comentarios.rows[j].conteudo, data_criacao: comentarios.rows[j].data_criacao })
            }

            publicacoes.rows[i].comentarios = aComentarios
            publicacoes.rows[i].openComentarios = false
            publicacoes.rows[i].id_publicador = id_publicador.rows[0].id
            if (id_publicador.rows[0].id === query.rows[0].id) {//se eu sou o dono da publicacao
                publicacoes.rows[i].owner = true
            }
            else {
                publicacoes.rows[i].owner = false
            }

            //deleta campo usertoken
            delete publicacoes.rows[i].usertoken

            var fotos = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [publicacoes.rows[i].user]);
            if (fotos.rowCount > 0) {
                publicacoes.rows[i].img = fotos.rows[0].img_json.img
            }
            else {
                publicacoes.rows[i].img = null
            }

        }

        res.json(publicacoes.rows);
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

publicacao.prototype.getByPubSearch = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var search = body.search;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var publicacoes = await pool.query("SELECT usuarios.id as user, usuarios.usertoken, usuarios.nome, publicacao.id, publicacao.conteudo, publicacao.visivel, publicacao.data_criacao FROM USUARIOS INNER JOIN publicacao ON publicacao.usertoken = usuarios.usertoken WHERE publicacao.conteudo LIKE $1 ORDER BY data_criacao DESC ", ['%' + search + '%']);

        if (publicacoes.rowCount < 1) {
            res.json([])
            return;
        }


        var likes = await pool.query("SELECT * FROM likes WHERE usertoken = $1", [
            usertoken
        ]);

        var usuarios = await pool.query("SELECT * FROM usuarios");

        for (var i = 0; i < publicacoes.rowCount; i++) {

            var id_publicador = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1 ORDER BY data_criacao", [
                publicacoes.rows[i].usertoken
            ]);

            //adiciona campo likes
            publicacoes.rows[i].curtiu = false
            for (var j = 0; j < likes.rowCount; j++) {
                if (likes.rows[j].id_pub == publicacoes.rows[i].id) {
                    publicacoes.rows[i].curtiu = true
                }
            }

            //adiciona campo criador
            for (var j = 0; j < usuarios.rowCount; j++) {
                if (usuarios.rows[j].usertoken == publicacoes.rows[i].usertoken) {
                    publicacoes.rows[i].nome = usuarios.rows[j].nome
                }
            }

            //adiciona campo comentarios
            var comentarios = await pool.query("SELECT * FROM comentarios WHERE id_pub = $1 ORDER BY data_criacao", [
                publicacoes.rows[i].id
            ]);

            var aComentarios = []

            for (var j = 0; j < comentarios.rowCount; j++) {
                var autor = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
                    comentarios.rows[j].usertoken
                ]);
                aComentarios.push({ id_autor: autor.rows[0].id, nome: autor.rows[0].nome, conteudo: comentarios.rows[j].conteudo, data_criacao: comentarios.rows[j].data_criacao })
            }

            publicacoes.rows[i].comentarios = aComentarios
            publicacoes.rows[i].openComentarios = false
            publicacoes.rows[i].id_publicador = id_publicador.rows[0].id
            if (id_publicador.rows[0].id === query.rows[0].id) {//se eu sou o dono da publicacao
                publicacoes.rows[i].owner = true
            }
            else {
                publicacoes.rows[i].owner = false
            }


            //deleta campo usertoken
            delete publicacoes.rows[i].usertoken

            var fotos = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [publicacoes.rows[i].user]);
            if (fotos.rowCount > 0) {
                publicacoes.rows[i].img = fotos.rows[0].img_json.img
            }
            else {
                publicacoes.rows[i].img = null
            }

        }

        res.json(publicacoes.rows);
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

publicacao.prototype.inserirLike = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var id = body.id;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json("Usuário invalido!")
            return;
        }

        const query2 = await pool.query("SELECT * FROM likes WHERE usertoken = $1 AND id_pub = $2", [
            usertoken, id
        ]);

        if (query2.rowCount > 0) { // descurtir
            const query3 = await pool.query("DELETE FROM likes WHERE usertoken = $1 AND id_pub = $2", [
                usertoken, id
            ]);

            res.json("Descurtido");
            return;
        }
        else { //curtir
            const query4 = await pool.query("INSERT INTO likes (usertoken, id_pub) VALUES ($1, $2)", [
                usertoken, id
            ]);
            res.json("Curtido");
            return;
        }

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

publicacao.prototype.comentar = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var id = body.id;
        var conteudo = body.conteudo;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json("Usuário invalido!")
            return;
        }

        if (conteudo.length < 1) {
            res.json("Comentario vazio!")
            return;
        }

        const query2 = await pool.query("INSERT INTO comentarios (usertoken, id_pub, conteudo) VALUES ($1, $2, $3)", [
            usertoken, id, conteudo
        ]);
        res.json("Comentado");
        return;


    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

module.exports = function () {
    return publicacao;
}