const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequestError = require('../utils/errors/bad-req-err');
const NotFoundError = require('../utils/errors/not-found-err');
const ConflictError = require('../utils/errors/conflict-err');
const UnauthorizedError = require('../utils/errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFoundError('Пользователь с указанным id не найден.'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { email, name },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Пользователь с указанным id не найден.'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует.'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении пользователя.',
          ),
        );
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then(async (hash) => {
      const user = await User.create({
        email,
        password: hash,
        name,
      });
      return res.send({ data: user.delPassword() });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует.'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError('Переданы некорректные данные при регистрации.'),
        );
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(new UnauthorizedError('Неправильные почта или пароль.'))
    .then(async (user) => {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        );
        res
          .cookie('jwt', token, {
            maxAge: 7 * 24 * 3600000,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          })
          .send({ data: user.delPassword() });
      } else {
        next(new UnauthorizedError('Неправильные почта или пароль.'));
      }
    })
    .catch(next);
};

module.exports.signout = (req, res, next) => {
  try {
    res
      .clearCookie('jwt')
      .send({ message: 'Совершен выход из учетной записи.' });
  } catch (err) {
    next(err);
  }
};

module.exports.checkAuth = (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.send({ authorized: false });
  } else {
    res.send({ authorized: true });
  }
};
