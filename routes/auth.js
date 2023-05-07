const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const { createUser, login, checkAuth } = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required(),
  }),
}), createUser);

router.get('/check', checkAuth);

module.exports = router;
