var nodemailer = require('nodemailer');
const pool = require("../../config/db");
require("dotenv").config();

function validarEmail() { }

validarEmail.prototype.validar = async function (req, res) {

	try {

		var body = req.body;
		var usertoken = body.usertoken;
	
		var query = await pool.query("SELECT * FROM usuarios_pendentes WHERE usertoken = $1", [
			usertoken
		]);

		if (query.rowCount < 1) {
			res.json("Validação inválida")
			return;
		}

		var query2 = await pool.query("INSERT INTO usuarios(nome, email, senha, sexo, data_nascimento, telefone, usertoken, ativo, tipo) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)", [
			query.rows[0].nome, query.rows[0].email, query.rows[0].senha, query.rows[0].sexo,
			query.rows[0].data_nascimento, query.rows[0].telefone,
			query.rows[0].usertoken, query.rows[0].ativo, query.rows[0].tipo
		]);

		var query3 = await pool.query("DELETE FROM usuarios_pendentes WHERE usertoken = $1", [
			usertoken
		]);

		res.json("Validação concluída!")
		return;
	}
	catch (err) {
		console.log(err);
		res.json(err + "")
	}
}

validarEmail.prototype.solicitarValidacao = async function (req, res) {

	try {

		var body = req.body;
		var email = body.email;

		var body = req.body;
		var to = body.email;

		var query = await pool.query("SELECT * FROM usuarios_pendentes WHERE email = $1", [
			email
		]);

		if (query.rowCount < 1) {
			res.json("Não há usuário com esse email esperando verificação")
			return;
		}

		var subject = "Confirmação de E-mail";
		var html = `<html>
        <head>
        <meta charset="UTF-8">
        
        </head>
        <body style="padding:0px;margin:0">
            <div style="color:#757575;display: flex;flex-direction: column;justify-content:flex-start;width: 100%;align-items: center;height: 100%; background-color: #EEEEEE; background-image:">
              <img style="width: 200px;margin-top:20px" src="https://lh3.googleusercontent.com/d/1teaItw2X97uYP4RUlmQ3p3FSWovQgem4" />
                    <h2 style="color: #FEAC0E;font-family:tahoma,verdana,segoe,sans-serif">Bem vindo ao programa Crystal!</h2>
                    <p style="font-family:tahoma,verdana,segoe,sans-serif">Para acessar o sistema basta verificar
                    seu E-mail clicando no link abaixo:</p>
                    <a style="font-family:tahoma,verdana,segoe,sans-serif" href="https://crystal-front-v1.herokuapp.com/validaEmail/` + query.rows[0].usertoken + `">Validar Email</a>.
                    
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

			from: 'Crystal Mailer' + '<' + process.env.EMAIL_SENDER_USER + '>',
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
				res.json('E-mail enviado para ' + to)
			}
		});
		return;
	}
	catch (err) {
		console.log(err);
		res.json(err + "")
	}
}

module.exports = function () {
	return validarEmail;
}