var nodemailer = require('nodemailer');
require("dotenv").config();

function email() { }

email.prototype.sendEmail = async function (req, res) {

	//res.json("Em manutenção")
	//return;
	try {

		var body = req.body;
		var to = body.to;
		var subject = body.subject;
		var html = body.html;

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
	return email;
}