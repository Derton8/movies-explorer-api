const express = require('express');
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const { urlRegExp } = require('../utils/constants');
const { signout } = require('../controllers/users');

const router = express.Router();
const {
  getMe,
  updateUser,
} = require('../controllers/users');

router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(urlRegExp),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.post('/signout', signout);

module.exports = router;
