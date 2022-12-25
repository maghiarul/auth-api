const express = require("express");
const app = express();
const mysql = require("mysql");
var db = require("./connection.js");
const cors = require("cors");
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  db.query("SELECT * FROM test", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
const JWT_SECRET =
  "apiohdpioahfpoisaop;eifhjpro9euighpoij0981u4-098u1349ihjn;okwsnef09u1=-092uklm";

app.post("/login", (req, res) => {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.password;
  if (pass !== null && pass !== undefined) {
    db.query(
      `SELECT password FROM test WHERE email = '${email}'`,
      (err, result) => {
        if (err) throw err;
        var phash = result[0].password;
        var p = pass;
        bcrypt.compare(p, phash, function (err, result) {
          if (err) throw err;
          if (result) {
            console.log(`User ${email} logged in`);
            return res.json({
              token: jsonwebtoken.sign({ user: `${email}` }, JWT_SECRET),
            });
          }
          if (!result) {
            res.status(400);
          }
        });
      }
    );
  } else {
    res.status(401);
    res.send({ error: "Wrong password" });
  }
});

app.post("/register", (req, res) => {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.password;
  bcrypt.hash(pass, 10, function (err, hash) {
    if (err) {
      res.status(400);
      res.send("Something happened... :/");
      throw err;
    }
    db.query(
      `INSERT INTO test (email, password) VALUES ('${email}', '${hash}')`,
      (err, result) => {
        if (err) throw err;
        res.status(200);
        res.send("Added succesfully !");
      }
    );
  });
});

app.listen(3001, () => {
  console.log("App running on port 3001");
});
