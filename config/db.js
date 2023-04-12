const Pool = require("pg").Pool;
require("dotenv").config();

//creds provided by:
//https://dashboard.render.com/d/dpg-cgrf3vbk9u56e3me0mgg-a

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;