const express = require("express");
const app = express();
const cors = require("cors");
var consign = require('consign');
require('./config/auth');

//middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');

consign()
    .include('src/routes')
    .then('src/models')
    .then('src/controllers')
    .into(app);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("Servidor rodando na porta " + port);
});