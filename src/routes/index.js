const express = require("express");
const { route } = require("express/lib/application");
const res = require("express/lib/response");
const DatabaseConnection = require("../config");
const middlewares = require("../middleware");


const router = express.Router();

//middleware global
router.use(middlewares.log);

//Get all
router.get("/user", async (req, resp) => {
  const databaseConnection = new DatabaseConnection();
  const db = await databaseConnection.connect();
  const { rows } = await db.query("select * from users");
  resp.send(rows);
});

//Get one by id
router.get("/user/:id", async (req, resp) => {
  const { id } = req.params;
  const databaseConnection = new DatabaseConnection();
  const db = await databaseConnection.connect();
  await db.query("select * from users where id = $1 ", [id], function (err, result) {
    if (err) throw err;
    if (result.rows != '')
      resp.send(result.rows)

    resp.sendStatus(404);

  });
  //console.log()

});


// Post user
router.post("/user", async (req, resp) => {
  const { body } = req;
  const { name, email, password } = body;
  const databaseConnection = new DatabaseConnection();
  const db = await databaseConnection.connect();
  const { rows } = await db.query(
    "insert into users (name, email, password) values($1, $2, $3) RETURNING *",
    [name, email, password]
  );
  resp.status(201).send(rows);
});
//Delete
router.delete("/user/:id", async (req, resp) => {
  const { id } = req.params;
  const databaseConnection = new DatabaseConnection();
  const db = await databaseConnection.connect();
  const { rows } = await db.query(
    "DELETE FROM users WHERE id=$1 RETURNING *",
    [id]
  );
  resp.status(202).send(rows);

})

router.patch("/user/:id", async (req, resp) => {
  const { body } = req;
  const { name, email, password } = body;
  const databaseConnection = new DatabaseConnection();
  const db = await databaseConnection.connect();
  const { rows } = await db.query(
    "update users SET name = $1, email = $2, password = $3, updateAt = CURRENT_TIMESTAMP WHERE id = $4",
    [name, email, password, req.params.id]
  );
  resp.status(201).send(rows);
})

module.exports = router;
