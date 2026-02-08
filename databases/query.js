const getDbConnection = require("./db");

//Runs the given sql query with the given parameters
async function doQuery(sql, params = []) {
  const db = await getDbConnection();
  const result = await db.query(sql, params);

  return result[0];
}

module.exports = doQuery;
