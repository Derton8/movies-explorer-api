const express = require('express');

const userRouter = require('./users');
const movieRouter = require('./movies');
const authRouter = require('./auth');
const auth = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/not-found-err');
const { signout } = require('../controllers/users');

const router = express.Router();

router.use('/', authRouter);

// роуты, которым авторизация нужна
router.use(auth);
router.post('/signout', signout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('/', (req, res, next) => {
  next(new NotFoundError('Error: 404 Not Found'));
});

module.exports = router;
