const { pool, sql } = require("../config/db");

exports.insertRows = async (rows) => {
  const p = await pool;

  for (let row of rows) {
    await p.request()
      .input("data", sql.NVarChar(sql.MAX), JSON.stringify(row))
      .query("INSERT INTO uploads (data) VALUES (@data)");
  }
};