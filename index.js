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

// app.post("/login", (req, res) => {
//   db.query(
//     "SELECT password FROM test WHERE email = 'cristi@gmail.com'",
//     (err, result) => {
//       if (err) throw err;
//       var hash = result[0].password;
//       var plaintextPassword = "cristi01";
//       bcrypt.compare(plaintextPassword, hash, function (err, result) {
//         if (err) throw err;
//         if (result) {
//           // password is valid
//           console.log("valid af");
//         }
//       });
//     }
//   );
// });
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
            console.log(`user ${email} logged in`);
            return res.json({
              token: jsonwebtoken.sign({ user: `${email}` }, JWT_SECRET),
            });
          }
          if (!result) {
            console.log("nu e mucho buenos");
            res.send("nu e bine ...");
          }
        });
      }
    );
  } else {
    res.send({ error: "parola gresita" });
  }
});

app.post("/register", (req, res) => {
  console.log(req.body);
  var email = req.body.email;
  var pass = req.body.password;
  bcrypt.hash(pass, 10, function (err, hash) {
    db.query(
      `INSERT INTO test (email, password) VALUES ('${email}', '${hash}')`,
      (err, result) => {
        if (err) throw err;
        console.log("register complete");
      }
    );
  });
});

app.listen(3001, () => {
  console.log("App running on port 3001");
});
