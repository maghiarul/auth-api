const express = require("express");
const app = express();
const mysql = require("mysql");
var db = require("./connection.js");
const cors = require("cors");
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// gets all the accounts from the database

// app.get("/", (req, res) => {
//   db.query("SELECT * FROM test", (err, result) => {
//     if (err) throw err;
//     res.send(result);
//   });
// });
const JWT_SECRET =
  "apiohdpioahfpoisaop;eifhjpro9euighpoij0981u4-098u1349ihjn;okwsnef09u1=-092uklm";

app.post("/login", (req, res) => {
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
              success: true,
            });
          }
          if (!result) {
            return res.json({
              success: false,
            });
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

app.post("/products", (req, res) => {
  var email = req.body.email;
  db.query(
    `SELECT * FROM products WHERE product_vendor IN (SELECT email FROM test WHERE email = '${email}')`,
    (err, result) => {
      res.send(result);
    }
    // once done with the request this will be the good query
  );
});

app.post("/delete", (req, res) => {
  var id = req.body.id;
  console.log(id);
  db.query(`DELETE products FROM products WHERE id = ${id}`, (err, result) => {
    res.send(result);
  });
});

app.post("/create", (req, res) => {
  var name = req.body.product_name;
  var price = req.body.product_price;
  var vendor = req.body.product_vendor;
  db.query(`INSERT INTO products (product_name, product_price, product_vendor) VALUES ('${name}', '${price}', '${vendor}')`, (err, result)=>{
    res.status(200)
    res.send("Product added successfully !")
  })
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
