const pool = require("../../config/db");
require("dotenv").config();

function chatPrivado() { }

chatPrivado.prototype.criarChatPrivado = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var amigoId = body.amigoId;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json("Usuário Invalido!")
            return;
        }

        //validade friendship
        var validarAmizade = await pool.query("SELECT * FROM amigos WHERE pessoa_id = $1 AND pessoa1_id = $2", [
            query.rows[0].id, amigoId
        ]);

        if (validarAmizade.rowCount < 1) {
            res.json('Amigo inválido!')
            return
        }

        var validarRedundancia = await pool.query("SELECT * FROM privado WHERE pessoa1_id = $1 AND pessoa2_id = $2", [
            query.rows[0].id, amigoId
        ]);

        var validarRedundancia2 = await pool.query("SELECT * FROM privado WHERE pessoa1_id = $1 AND pessoa2_id = $2", [
            amigoId, query.rows[0].id,
        ]);

        if (validarRedundancia.rowCount > 0 || validarRedundancia2.rowCount > 0) {
            res.json('Já existe um chat privado em aberto com esse usuário.')
            return
        }

        const createPrivado = await pool.query("INSERT INTO privado(pessoa1_id, pessoa2_id) VALUES ($1, $2)", [
            query.rows[0].id, amigoId
        ]);

        res.json("Conversa Inserida!")
        return;

    }
    catch (err) {
        console.log(err);
        res.json(err);
        return;
    }
}

chatPrivado.prototype.getChatPrivado = async function (req, res) {
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

        var getChats = await pool.query("select * from privado where pessoa1_id= $1 or pessoa2_id = $2", [
            query.rows[0].id, query.rows[0].id
        ]);

        if (getChats.rowCount > 0) {
            for (var i = 0; i < getChats.rowCount; i++) {
                var getParticipante = ''
                var getFoto = ''

                if (getChats.rows[i].pessoa1_id !== query.rows[0].id) {
                    getParticipante = await pool.query("select nome from usuarios where id = $1", [
                        getChats.rows[i].pessoa1_id
                    ]);
                    getFoto = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
                        getChats.rows[i].pessoa1_id
                    ]);
                }
                else {
                    getParticipante = await pool.query("select nome from usuarios where id = $1", [
                        getChats.rows[i].pessoa2_id
                    ]);
                    getFoto = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
                        getChats.rows[i].pessoa2_id
                    ]);
                }
                getChats.rows[i]['participante'] = getParticipante.rows
                if (getFoto.rowCount > 0) {
                    getChats.rows[i]['foto'] = getFoto.rows
                }
                else {
                    getChats.rows[i]['foto'] = []
                }

            }
            res.json(getChats.rows)
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

chatPrivado.prototype.getChatPrivadoById = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var chatPrivadoId = body.chatPrivadoId

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json("Usuário Invalido!")
            return;
        }

        var getChats = await pool.query("select * from privado where id = $1", [
            chatPrivadoId
        ]);

        if (getChats.rowCount > 0) {
            for (var i = 0; i < getChats.rowCount; i++) {
                var getParticipante = ''
                var getFoto = ''

                if (getChats.rows[i].pessoa1_id !== query.rows[0].id) {
                    getParticipante = await pool.query("select nome from usuarios where id = $1", [
                        getChats.rows[i].pessoa1_id
                    ]);
                    getFoto = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
                        getChats.rows[i].pessoa1_id
                    ]);
                }
                else {
                    getParticipante = await pool.query("select nome from usuarios where id = $1", [
                        getChats.rows[i].pessoa2_id
                    ]);
                    getFoto = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
                        getChats.rows[i].pessoa2_id
                    ]);
                }
                getChats.rows[i]['participante'] = getParticipante.rows
                if (getFoto.rowCount > 0) {
                    getChats.rows[i]['foto'] = getFoto.rows
                }
                else {
                    getChats.rows[i]['foto'] = []
                }

            }
            res.json(getChats.rows)
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

chatPrivado.prototype.setMensagensPrivado = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var chatPrivado_id = body.chatPrivado_id;
        var mensagem = body.mensagem;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var getChat = await pool.query("select * from privado where id = $1", [
            chatPrivado_id
        ]);

        if (getChat.rowCount > 0) {
            var insertMsg = await pool.query("insert into mensagem_privada (conteudo, autor, privado_id) VALUES ($1, $2, $3)", [
                mensagem, query.rows[0].id, chatPrivado_id
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

chatPrivado.prototype.getMensagensPrivado = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var chatPrivado_id = body.chatPrivado_id;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var getChat = await pool.query("select * from privado where id = $1", [
            chatPrivado_id
        ]);

        if (getChat.rowCount > 0) {
            var getMensagens = await pool.query("select * from mensagem_privada where privado_id = $1 ORDER BY data_criacao ASC", [
                chatPrivado_id
            ]);

            for(var i = 0; i < getMensagens.rowCount; i++){
                var getFoto = await pool.query("select img_json from foto_perfil where user_id = $1", [
                    getMensagens.rows[i].autor
                ]);

                var getNome = await pool.query("select nome from usuarios where id = $1", [
                    getMensagens.rows[i].autor
                ]);

                if(getFoto.rowCount > 0){
                    getMensagens.rows[i]['foto'] = getFoto.rows[0].img_json.img
                }
                
                getMensagens.rows[i]['nome'] = getNome.rows[0].nome
    
                if(getMensagens.rows[i].autor === query.rows[0].id){
                    getMensagens.rows[i]['self'] = true
                }
                else{
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

module.exports = function () {
    return chatPrivado;
}