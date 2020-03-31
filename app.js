const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Posts', { useNewUrlParser: true });

const authorRouter = require("./Views/author");
const postRouter = require("./Views/posts");

app.use("/api", authorRouter);
app.use("/api", postRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`)
})