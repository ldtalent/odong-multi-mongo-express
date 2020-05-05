const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


mongoose.connect('mongodb://localhost:27017/Posts');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const authorRouter = require('./Views/author');
const postRouter = require('./Views/posts');

app.use('/api', authorRouter);
app.use('/api', postRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`);
});
