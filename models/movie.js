const mongoose = require('mongoose');
// const validator = require('validator');

const { urlRegExp } = require('../utils/constants');
const user = require('./user');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlRegExp.test(value),
      message: 'Invalid link',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlRegExp.test(value),
      message: 'Invalid link',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => urlRegExp.test(value),
      message: 'Invalid link',
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
    ref: user,
  },
  movieId: {
    type: Number,
    required: true,
    // validate: {
    //   validator: (value) => validator.isInt(value),
    //   message: 'Invalid email',
    // },
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
