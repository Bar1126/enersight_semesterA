const getDbConnection = require("./db");

async function doQuery(sql, params = []) {
  const db = await getDbConnection();
  const result = await db.query(sql, params);

  return result[0];
}

module.exports = doQuery;
