const Movie = require('../models/movie');
const BadRequestError = require('../utils/errors/bad-req-err');
const ForbiddenError = require('../utils/errors/forbidden-err');
const NotFoundError = require('../utils/errors/not-found-err');

module.exports.getMovies = ((req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movies) => res.send({ data: movies }))
    .catch(next);
});

module.exports.createMovie = ((req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((data) => data.populate(['owner']).then((movie) => res.send({ data: movie })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
        return;
      }
      next(err);
    });
});

module.exports.deleteMovie = ((req, res, next) => {
  const { _id } = req.params;
  const userId = req.user._id;
  Movie.findById(_id)
    .orFail(new NotFoundError('Фильм с указанным id не найден.'))
    .then(async (movie) => {
      if (userId.toString() !== movie.owner.toString()) {
        return next(new ForbiddenError('Фильм принадлежит другому пользователю.'));
      }
      const movieDelete = await movie.deleteOne();
      return res.send({ data: movieDelete });
    })
    .catch(next);
});
