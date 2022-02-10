// require("dotenv").config();
var mysql = require("mysql");
var moment = require("moment");
var path = require("path");

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1984",
  database: "blog",
});

con.connect(function (err) {
  console.log("connected");
  if (err) throw err;
});

function create(req, res) {
  const { title } = req.body;

  if (!title) {
    res.status(401).json({ error: "Title is required" });
    return false;
  }
  // let filename = path.join(__dirname, "../../", "images", req.file.filename);

  const dateNow = moment().format("YYYY-MM-DD");

  var sql = `INSERT INTO blog (title, date) VALUES ('${title}', '${dateNow}')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    const blogID = result.insertId;
    res.status(200).json({ data: "Success", dataID: blogID });
  });
}

function createImage(req, res) {
  // const db = req.app.get('db');

  const { content } = req.body;
  const { id } = req.params;

  if (!content || !req.file) {
    res.status(401).json({ error: "Content and Image is required" });
    return false;
  }
  let filename = path.join(__dirname, "../../", "images", req.file.filename);

  var sql = `INSERT INTO image_content (blog_id, content, image) VALUES (${id},'${content}', '${filename}')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    // console.log(result);
    res.status(200).json({ data: "Success", dataID: result.insertId });
  });
}

function getImage(req, res) {
  const { id } = req.params;
  var sql = `SELECT * FROM image_content WHERE blog_id = ${id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
}

function listBlog(req, res) {
  var sql = `SELECT * from blog;`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
}

function editBlog(req, res) {
  const { id } = req.params;
  const { title } = req.body;

  if (!id) {
    res.status(401).json({ error: "ID is required" });
  } else if (!title) {
    res.status(401).json({ error: "Title is required" });
  }

  var sql = `UPDATE blog SET title = '${title}' WHERE id = ${id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json({ data: "Success" });
  });
}

function getBlog(req, res) {
  const { id } = req.params;
  var sql = `SELECT * FROM blog WHERE id = ${id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
}

function getOneImg(req, res) {
  const { id, imgID } = req.params;
  var sql = `SELECT * FROM image_content WHERE id = ${imgID} AND blog_id = ${id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
}

function deleteImg(req, res) {
  const { id } = req.params;
  var sql = `DELETE FROM image_content WHERE id = ${id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json({ data: "Success" });
  });
}

function deleteBlog(req, res) {
  const { id } = req.params;
  var sql = `DELETE FROM blog WHERE id = ${id}`;
  var sql1 = `DELETE FROM image_content WHERE blog_id = ${id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    con.query(sql1, function (err1, result1) {
      if (err1) throw err1;
      res.status(200).json({ data: "Success" });
    });
  });
}

function searchBlog(req, res) {
  const { search } = req.body;
  console.log(search);
  var sql = `SELECT id, title, date FROM blog WHERE title LIKE "%${search}%"`;

  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
}

function searchImg(req, res) {
  const { search } = req.body;
  const { id } = req.params;
  // console.log(search);
  var sql = `SELECT id, image, content FROM image_content WHERE content LIKE "%${search}%" AND blog_id = ${id}`;

  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
  });
}

module.exports = {
  create,
  createImage,
  getImage,
  listBlog,
  editBlog,
  getBlog,
  deleteImg,
  deleteBlog,
  getOneImg,
  searchBlog,
  searchImg,
};
