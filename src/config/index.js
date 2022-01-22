const { Pool } = require("pg");

class DatabaseConnection {
  constructor() {
    if (!DatabaseConnection._instance) {
      DatabaseConnection.connectDB = null;
      DatabaseConnection._instance = this;
    }
    return DatabaseConnection._instance;
  }

  async connect() {
    try {
      return await this._connection();
    } catch (e) {
      this.connectDB = null;
      return await this._connection();
    }
  }

  async _connection() {
    if (DatabaseConnection.connectDB) {
        return DatabaseConnection.connectDB;
    }
    
    const pool = new Pool({
      connectionString:
        "postgres://fggqoxgi:GKvMjvU-n0RQ-FV1Y_cmZUyhhEeZOgsR@hansken.db.elephantsql.com/fggqoxgi",
    });
    const client = await pool.connect();
    DatabaseConnection.connectDB = pool;
    const res = await client.query("SELECT NOW()");
    console.log(res.rows[0]);
    client.release();
    return pool.connect();
  }
}

module.exports = DatabaseConnection;
