const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Hello124@",
  database: "nodemysql",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected...");
});

//CREATE DATABASE
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE nodemysql";
  db.query(sql, (err, result) => {
    if (err) throw err;

    console.log(result);
    res.send("Database Created...");
  });
});

//CREATE TABLE
app.get("/createlibrarytable", (req, res) => {
  let sql =
    "CREATE TABLE library(rollno INT NOT NULL, firstname VARCHAR(50),lastname VARCHAR(50),name VARCHAR(100) AS (CONCAT(firstname,' ',lastname)),age INT, email VARCHAR(50),faculty VARCHAR(50) NOT NULL, semester VARCHAR(50) NOT NULL, bookName VARCHAR(50),college VARCHAR(50) NOT NULL,batch VARCHAR(255) NOT NULL,dob DATE,id VARCHAR(255) AS (CONCAT(college,batch,faculty,rollno)) UNIQUE)";

  db.query(sql, (err, result) => {
    if (err) throw err;

    // console.log(result);
    res.send(result);
  });
});

//INSERT Book
app.get("/addbook", (req, res) => {
  const {
    firstname,
    lastname,
    rollno,
    age,
    dob,
    email,
    faculty,
    semester,
    bookName,
    batch,
    college,
  } = req.query;

  let newBook = {
    firstname,
    lastname,
    rollno,
    age,
    email,
    dob: dob.split("T")[0],
    faculty,
    semester,
    bookName,
    batch,
    college,
  };

  let sql = "INSERT INTO library SET ?";
  let query = db.query(sql, newBook, (err, result) => {
    if (err) throw err;

    // console.log(result);
    res.json({ message: "Book Added...", data: result });
  });
});

//SELECT Books
app.get("/getbooks", (req, res) => {
  let sql = "SELECT * FROM library";
  let query = db.query(sql, (err, result) => {
    if (err) throw err;

    // console.log(result);
    res.json({ message: "Books Fetched...", data: result });
  });
});

//SELECT SINGLE BOOK
app.get("/getbookbyfilter", (req, res) => {
  console.log(req.query);
  let sql = `SELECT * FROM library WHERE name LIKE '${req.query.name}%' AND bookName LIKE '${req.query.bookName}%' AND id LIKE '${req.query.id}%' AND college LIKE '${req.query.college}%' AND semester LIKE '${req.query.semester}%' AND faculty LIKE '${req.query.faculty}%'`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;

    // console.log(result);
    res.json({ message: "Books Fetched...", data: result });
  });
  // console.log(query);
});

//UPDATE Book
app.get("/updatebook/:id", (req, res) => {
  console.log(req.query);
  const {
    firstname,
    lastname,
    rollno,
    age,
    dob,
    email,
    faculty,
    semester,
    bookName,
    batch,
    college,
  } = req.query;

  let updatedBook = {
    firstname,
    lastname,
    rollno,
    age,
    email,
    dob: dob.split("T")[0],
    faculty,
    semester,
    bookName,
    batch,
    college,
  };
  // console.log(updatedStudent, req.params.id);

  let sql = `UPDATE library SET ? WHERE id = '${req.params.id}'`;
  db.query(sql, updatedBook, (err, result) => {
    if (err) throw err;

    // console.log(result);
    res.json({ message: "Book Updated...", data: result });
  });
});

//DELETE STUDENT
app.get("/deletebook/:id", (req, res) => {
  // console.log(req.params.id);
  let sql = `DELETE FROM library WHERE id = '${req.params.id}'`;
  db.query(sql, (err, result) => {
    if (err) throw err;

    // console.log(result);
    res.json({ message: "Book Deleted...", data: result });
  });
});

//SEARCH BY ID
app.get("/searchBook/:id", (req, res) => {
  console.log(req.params.id);
  let sql = `SELECT * FROM library WHERE id = '${req.params.id}'`;
  db.query(sql, (err, result) => {
    if (err) throw err;

    // console.log(result);
    res.json({ message: "Book Found", data: result });
  });
});

app.listen("5000", () => {
  console.log("Server has been started!!!");
});
