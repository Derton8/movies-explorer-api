require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleErrors } = require('./middlewares/errors');
const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect('mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => console.log('Connected to DB!'))
  .catch((err) => console.log(err));

app.use(requestLogger);
app.use(cors);
app.use('/', router);
app.use(errorLogger);

app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App listening on ${PORT} port..`);
});
