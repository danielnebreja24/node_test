require("dotenv").config();
const express = require("express");
const multer = require("multer");
var cors = require("cors");

const blog = require("./controllers/blog");

const app = express();
app.use(express.static("images"));

app.use(cors());

app.use(express.json());

const upload = multer({ dest: "images/" });

// BLOG
app.post("/api/blog", blog.create);
app.get("/api/blog/", blog.listBlog);
app.patch("/api/blog/:id", blog.editBlog);
app.get("/api/blog/:id", blog.getBlog);
app.delete("/api/blog/:id", blog.deleteBlog);
app.post("/api/blog/search", blog.searchBlog);

// BLOG IMAGE AND CONTENT
app.post("/api/blog/image/:id", upload.single("image"), blog.createImage);
app.get("/api/blog/images/:id", blog.getImage);
app.get("/api/blog/image/:id/:imgID", blog.getOneImg);
app.delete("/api/blog/image/:id", blog.deleteImg);
app.post("/api/blog/image/search/:id", blog.searchImg);

const PORT = process.env.PORT;
console.log(PORT);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
