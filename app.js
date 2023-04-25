const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/moviesdb')
  .then(() => console.log('Connected to DB!'))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`App listening on ${PORT} port..`);
});
