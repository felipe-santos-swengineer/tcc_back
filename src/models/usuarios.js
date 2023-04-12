const pool = require("../../config/db");
const { v4: uuidv4 } = require('uuid');
var validator = require('validator');
var verifyString = require('../functions/verifyString')
var nodemailer = require('nodemailer');
require("dotenv").config();

function usuarios() { }

usuarios.prototype.login = async function (req, res) {
    try {

        var body = req.body;
        var email = body.email;
        var senha = body.senha;

        const query = await pool.query("SELECT * FROM usuarios WHERE email = $1 AND senha = $2", [
            email, senha
        ]);

        if (query.rowCount < 1) {
            const query2 = await pool.query("SELECT * FROM usuarios_pendentes WHERE email = $1 AND senha = $2", [
                email, senha
            ]);

            if (query2.rowCount < 1) {
                res.json("Email ou senha inválidos");
                return;
            }
            else {
                var to = query2.rows[0].email;
                var subject = "Confirmação de E-mail";
                var html = `<html>
                                <head>
                                <meta charset="UTF-8">
                                
                                </head>
                                <body style="padding:0px;margin:0">
                                    <div style="color:#757575;display: flex;flex-direction: column;justify-content:flex-start;width: 100%;align-items: center;height: 100%; background-color: #EEEEEE; background-image:">
                                        <h2 style="color: #FEAC0E;font-family:tahoma,verdana,segoe,sans-serif">Bem vindo ao Talkdoor!</h2>
                                        <p style="font-family:tahoma,verdana,segoe,sans-serif">Para acessar o sistema basta verificar seu E-mail clicando no link abaixo:</p>
                                        <a style="font-family:tahoma,verdana,segoe,sans-serif" href=` + process.env.FRONT_DOMAIN + `/verificarEmail/` + query2.rows[0].usertoken + `>Validar Email</a>.  
                                    </div>
                                </body>
                            </html>`;

                var conta = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_SENDER_USER,
                        pass: process.env.EMAIL_SENDER_PASS
                    }
                });

                await conta.sendMail({

                    from: 'Talkdoor Mailer' + '<' + process.env.EMAIL_SENDER_USER + '>',
                    to: '<' + to + '>',
                    subject: subject + "",
                    html: html + ""

                }, function (err) {
                    if (err) {
                        console.log(err);
                        res.json(err + "")
                    }
                    else {
                        console.log('E-mail enviado para ' + to);
                        res.json("Aguandando verificação de email, verifique a caixa de entrada: " + to);
                    }
                });
                return;
            }

        }

        res.json(query.rows[0]);

    }
    catch (err) {
        console.log(err);
        res.json(err)
    }
}

usuarios.prototype.inserir = async function (req, res) {
    try {

        var body = req.body;
        var nome = body.nome.trim();
        var email = body.email.toLowerCase().trim();
        var senha = body.senha.trim();
        var data_nascimento = body.data.trim();
        var telefone = body.telefone.trim();
        var sexo = body.sexo.trim();
        var usertoken = uuidv4();

        //validação

        if (validator.isEmail(email) === false) {
            res.json("Email inválido");
            return;
        }

        if (email.includes("@ufc.br") || email.includes("@alu.ufc.br")) {
        }
        else {
            res.json("Apenas emails UFC são aceitos");
            return;
        }

        if (senha.length < 6) {
            res.json("A senha precisa de pelo menos 6 caracteres");
            return;
        }

        if (verifyString(senha) === false || verifyString(data_nascimento) === false || verifyString(nome) === false || verifyString(sexo) === false) {
            res.json("Há campo(s) inválido(s) ou vazio(s)");
            return;
        }

        const query = await pool.query("SELECT * FROM usuarios_pendentes WHERE email = $1", [
            email
        ]);

        if (query.rowCount > 0) {
            res.json("Email já existe, aguandando verificação de email");
            return;
        }

        const query1 = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
            email
        ]);

        if (query1.rowCount > 0) {
            res.json("Email já está cadastrado");
            return;
        }

        //criação

        const query2 = await pool.query("INSERT INTO usuarios_pendentes (email, senha, data_nascimento, nome, telefone, usertoken, sexo) VALUES ($1,$2,$3,$4,$5,$6,$7)", [
            email, senha, data_nascimento, nome, telefone, usertoken, sexo
        ]);

        res.json("Usuário inserido");
        return


    }
    catch (err) {
        console.log(err);
        res.json(err)
    }
}

usuarios.prototype.getByToken = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken
        //validação

        const query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount > 0) {
            res.json(query.rows[0]);
            return;
        }

        res.json([]);
        return


    }
    catch (err) {
        console.log(err);
        res.json(err)
    }
}


usuarios.prototype.update = async function (req, res) {
    try {

        var body = req.body;
        var usertoken = body.usertoken;


        var query = await pool.query("SELECT * FROM usuarios WHERE usertoken = $1", [
            usertoken
        ]);

        if (query.rowCount < 1) {
            res.json("Usuário inválido")
            return;
        }

        var userRow = query.rows[0];

        var email = body.email || userRow.email;
        var senha = body.senha || userRow.senha;
        var data_nascimento = body.data_nascimento || userRow.data_nascimento;
        var nome = body.nome || userRow.nome;
        var telefone = body.telefone || userRow.telefone;
        var cidade = body.cidade || userRow.cidade;

        query = await pool.query("UPDATE usuarios SET email = $1, senha = $2, data_nascimento = $3, nome = $4, telefone = $5, cidade = $6 WHERE usertoken = $7", [
            email, senha, data_nascimento, nome, telefone, cidade, usertoken
        ]);

        res.json("Usuario atualizado");

    }
    catch (err) {
        console.log(err);
        res.json(err)
    }
}

module.exports = function () {
    return usuarios;
}