const Pool = require("pg").Pool;
require("dotenv").config();

//creds provided by:
//https://dashboard.render.com/d/dpg-cgrf3vbk9u56e3me0mgg-a

var pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB,
  ssl: {
    rejectUnauthorized: false
  }
});

if (!global.connection) {
  global.connection = pool;
}

async function clearConnections() {

  const query = await global.connection.query("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = $1", [process.env.DB])

}

clearConnections()

module.exports = global.connection;