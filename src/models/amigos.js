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
        var naoAmigos = [];

        //para cada usuario diferente de mim
        for (var i = 0; i < query.rowCount; i++) {

            //verifica se ja somos amigos
            query1 = await pool.query("SELECT * FROM amigos WHERE pessoa_id = $1 AND pessoa1_id = $2", [
                query.rows[i].id, query_.rows[0].id
            ]);
            

            //verificar se algum dos dois solicitou amizade
            const query2 = await pool.query("SELECT * FROM solicitacao_amigo WHERE de_id = $1 AND para_id = $2", [
                query_.rows[0].id, query.rows[i].id
            ]);
            

            const query3 = await pool.query("SELECT * FROM solicitacao_amigo WHERE de_id = $1 AND para_id = $2", [
                query.rows[i].id, query_.rows[0].id
            ]);
            

            //se passou em tudo, é uma pessoa desconhecida
            if (query1.rowCount < 1 && query2.rowCount < 1 && query3.rowCount < 1) {
                //busca foto de pf
                const query4 = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
                    query.rows[i].id
                ]);
                

                var foto = ''

                //se achou foto no banco, devolve
                if (query4.rowCount > 0) {
                    foto = query4.rows[0].img_json.img
                }

                naoAmigos.push({ nome: query.rows[i].nome, id: query.rows[i].id, foto: foto })
            }
        }

        res.json(naoAmigos);
        return;

    }
    catch (err) {
        console.log(err);
        res.json([]);
        return;
    }
}

amigos.prototype.naoAmigosComum = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var id = body.id;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken != $1 AND id != $2", [
            usertoken, id
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
        var naoAmigos = [];

        //para cada usuario diferente de mim
        for (var i = 0; i < query.rowCount; i++) {

            //verificar se é amigo do usuario do perfil
            const query5 = await pool.query("SELECT * FROM amigos WHERE pessoa_id = $1 AND pessoa1_id = $2", [
                id, query_.rows[0].id
            ]);
            

            if (query5.rowCount > 0) {

                //verifica se é amigo meu 
                query1 = await pool.query("SELECT * FROM amigos WHERE pessoa_id = $1 AND pessoa1_id = $2", [
                    query.rows[i].id, query_.rows[0].id
                ]);
                

                //verificar se algum dos dois solicitou amizade
                const query2 = await pool.query("SELECT * FROM solicitacao_amigo WHERE de_id = $1 AND para_id = $2", [
                    query_.rows[0].id, query.rows[i].id
                ]);
                

                const query3 = await pool.query("SELECT * FROM solicitacao_amigo WHERE de_id = $1 AND para_id = $2", [
                    query.rows[i].id, query_.rows[0].id
                ]);
                

                //se passou em tudo, é uma pessoa desconhecida
                if (query1.rowCount < 1 && query2.rowCount < 1 && query3.rowCount < 1) {
                    //busca foto de pf
                    const query4 = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
                        query.rows[i].id
                    ]);
                    


                    var foto = ''

                    //se achou foto no banco, devolve
                    if (query4.rowCount > 0) {
                        foto = query4.rows[0].img_json.img
                    }

                    naoAmigos.push({ nome: query.rows[i].nome, id: query.rows[i].id, foto: foto })
                }

            }

            console.log(naoAmigos.length)
        }

        res.json(naoAmigos);
        return;

    }
    catch (err) {
        console.log(err);
        res.json([]);
        return;
    }
}

amigos.prototype.amigos = async function (req, res) {
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

        var query1;
        var amigos = [];

        query1 = await pool.query("SELECT ami.pessoa1_id as id, usu.nome as nome FROM usuarios usu INNER JOIN amigos ami ON usu.id = ami.pessoa1_id WHERE pessoa_id = $1", [
            query.rows[0].id
        ]);
        

        for (var i = 0; i < query1.rowCount; i++) {
            const query2 = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
                query1.rows[i].id
            ]);
            

            var foto = ''

            //se achou foto no banco, devolve
            if (query2.rowCount > 0) {
                foto = query2.rows[0].img_json.img
            }

            amigos.push({ nome: query1.rows[i].nome, id: query1.rows[i].id, foto: foto })
        }

        res.json(amigos);
        return;

    }
    catch (err) {
        console.log(err);
        res.json([]);
        return;
    }
}


amigos.prototype.amigosComum = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var id = body.id;

        console.log(id)

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);
        

        if (query.rowCount < 1) {
            res.json([])
            return;
        }

        var query1;
        var amigos = [];

        query1 = await pool.query("SELECT ami.pessoa1_id as id, usu.nome as nome FROM usuarios usu INNER JOIN amigos ami ON usu.id = ami.pessoa1_id WHERE pessoa_id = $1 AND EXISTS ( SELECT amig.pessoa1_id FROM amigos amig WHERE amig.pessoa_id = $2 AND amig.pessoa1_id = ami.pessoa1_id )", [
            query.rows[0].id, id
        ]);
        

        for (var i = 0; i < query1.rowCount; i++) {
            const query2 = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
                query1.rows[i].id
            ]);
            

            var foto = ''

            //se achou foto no banco, devolve
            if (query2.rowCount > 0) {
                foto = query2.rows[0].img_json.img
            }

            amigos.push({ nome: query1.rows[i].nome, id: query1.rows[i].id, foto: foto })
        }

        res.json(amigos);
        return;

    }
    catch (err) {
        console.log(err);
        res.json([]);
        return;
    }
}

amigos.prototype.getSolicitacoes = async function (req, res) {
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

        //Solicitacoes enviadas
        const query1 = await pool.query("SELECT usu.nome as nome, usu.id as id FROM solicitacao_amigo sol INNER JOIN usuarios usu ON usu.id = sol.para_id WHERE sol.de_id = $1", [
            query.rows[0].id
        ]);
        


        //Solicitacoes recebidas
        const query2 = await pool.query("SELECT usu.nome as nome, usu.id as id FROM solicitacao_amigo sol INNER JOIN usuarios usu ON usu.id = sol.de_id WHERE sol.para_id = $1", [
            query.rows[0].id
        ]);
        

        var enviadas = []
        var recebidas = []

        //adiciona fotos
        for (var i = 0; i < query1.rowCount; i++) {
            const query3 = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
                query1.rows[i].id
            ]);
            

            var foto = ''

            //se achou foto no banco, devolve
            if (query3.rowCount > 0) {
                foto = query3.rows[0].img_json.img
            }
            enviadas.push({ nome: query1.rows[i].nome, id: query1.rows[i].id, foto: foto })
        }

        for (var i = 0; i < query2.rowCount; i++) {
            const query4 = await pool.query("SELECT id, img_json FROM foto_perfil WHERE user_id = $1", [
                query2.rows[i].id
            ]);
            

            var foto = ''

            //se achou foto no banco, devolve
            if (query4.rowCount > 0) {
                foto = query4.rows[0].img_json.img
            }
            recebidas.push({ nome: query2.rows[i].nome, id: query2.rows[i].id, foto: foto })
        }

        res.json([{ enviadas: enviadas, recebidas: recebidas }]);
        return;

    }
    catch (err) {
        console.log(err);
        res.json([]);
        return;
    }
}

amigos.prototype.adicionar = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var to_id = body.to_id;

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


amigos.prototype.remover = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;
        var to_id = body.to_id;

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);
        

        if (query.rowCount < 1) {
            res.json("Usuário Invalido!")
            return;
        }

        const pessoa1 = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
            to_id
        ]);
        

        const pessoa2 = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
            query.rows[0].id
        ]);
        

        //Delete relação de amizade
        const deleteRelation1 = await pool.query("DELETE FROM amigos WHERE pessoa_id = $1 AND pessoa1_id = $2", [
            pessoa1.rows[0].id, pessoa2.rows[0].id
        ]);
        

        const deleteRelation2 = await pool.query("DELETE FROM amigos WHERE pessoa_id = $1 AND pessoa1_id = $2", [
            pessoa2.rows[0].id, pessoa1.rows[0].id
        ]);
        

        //Delete relação de solicitacao
        var deleteRelation3 = await pool.query("DELETE FROM solicitacao_amigo WHERE de_id = $1 AND para_id = $2", [
            pessoa1.rows[0].id, pessoa2.rows[0].id
        ]);
        
        var deleteRelation4 = await pool.query("DELETE FROM solicitacao_amigo WHERE de_id = $1 AND para_id = $2", [
            pessoa2.rows[0].id, pessoa1.rows[0].id
        ]);
        

        res.json("Amizade removida!");
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