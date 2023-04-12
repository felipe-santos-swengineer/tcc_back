const pool = require("../../config/db");

function home() { }

home.prototype.testBD = async function (req, res) {
  try {
    const test = await pool.query("SELECT NOW()");
    if (test.rowCount > 0) {
      res.json(test.rows[0]);
      return;
    }
    res.json("Aplicação rodando, mas o Banco de Dados está OFF!")
    return;
  }
  catch(err){
    console.log(err)
  }
}

module.exports = function () {
  return home;
}