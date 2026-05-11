const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Movie = require('../models/movie');
const Review = require('../models/review');
const userModeling = require('../utils/userModeling');

const router = new express.Router();
console.log('Movie Router Loaded');

// Create a movie
router.post('/movies', auth.enhance, async (req, res) => {
  const movie = new Movie(req.body);
  try {
    await movie.save();
    res.status(201).send(movie);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Add a review to a movie
router.post('/movies/:id/reviews', auth.simple, async (req, res) => {
  const movieId = req.params.id;
  const { rating, comment, userName } = req.body;
  const userId = req.user._id;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.sendStatus(404);

    const review = new Review({
      movieId,
      userId,
      userName,
      rating,
      comment,
    });

    await review.save();

    // Update movie average rating (only from Approved reviews)
    const approvedReviews = await Review.find({ movieId, status: 'Approved' });
    if (approvedReviews.length > 0) {
      const avgRating = approvedReviews.reduce((acc, cur) => acc + cur.rating, 0) / approvedReviews.length;
      movie.rating = parseFloat(avgRating.toFixed(1));
      await movie.save();
    }

    res.status(201).send({ review, movie });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all reviews for a movie
router.get('/movies/:id/reviews', async (req, res) => {
  const movieId = req.params.id;
  const { all } = req.query;
  try {
    const query = all === 'true' ? { movieId } : { movieId, status: 'Approved' };
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.send(reviews);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post(
  '/movies/photo/:id',
  auth.enhance,
  upload('movies').single('file'),
  async (req, res, next) => {
    const { file } = req;
    const movieId = req.params.id;
    try {
      if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
      }
      const movie = await Movie.findById(movieId);
      if (!movie) return res.sendStatus(404);
      movie.image = `/${file.path}`;
      await movie.save();
      res.send({ movie, file });
    } catch (e) {
      console.log(e);
      res.sendStatus(400).send(e);
    }
  }
);

router.post(
  '/movies/backdrops/:id',
  auth.enhance,
  upload('movies').array('files'),
  async (req, res, next) => {
    const { files = [] } = req;
    const movieId = req.params.id;
    try {
      if (!files.length) {
        const error = new Error('Please upload at least one file');
        error.httpStatusCode = 400;
        return next(error);
      }
      const movie = await Movie.findById(movieId);
      if (!movie) return res.sendStatus(404);
      const uploaded = files.map(file => `/${file.path}`);
      movie.backdropImages = [...(movie.backdropImages || []), ...uploaded];
      movie.markModified('backdropImages');
      await movie.save();
      return res.send({ movie, files });
    } catch (e) {
      return res.status(400).send(e);
    }
  }
);

router.post(
  '/movies/cast-crew-images/:id',
  auth.enhance,
  upload('movies').array('files'),
  async (req, res, next) => {
    const { files = [] } = req;
    const movieId = req.params.id;
    try {
      if (!files.length) {
        const error = new Error('Please upload at least one file');
        error.httpStatusCode = 400;
        return next(error);
      }
      const movie = await Movie.findById(movieId);
      if (!movie) return res.sendStatus(404);

      const castCrew = Array.isArray(movie.castCrew) ? movie.castCrew : [];
      files.forEach((file, index) => {
        if (castCrew[index]) {
          castCrew[index].image = `/${file.path}`;
        }
      });
      movie.castCrew = castCrew;
      movie.markModified('castCrew');
      await movie.save();
      return res.send({ movie, files });
    } catch (e) {
      return res.status(400).send(e);
    }
  }
);

// Get all movies
router.get('/movies', async (req, res) => {
  const { all } = req.query;
  try {
    const movies = all === 'true' ? await Movie.find({}) : await Movie.find({ isPublished: { $ne: false } });
    res.send(movies);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get movie by id
router.get('/movies/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const movie = await Movie.findById(_id);
    if (!movie) return res.sendStatus(404);
    return res.send(movie);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Update movie by id
router.put('/movies/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const allowedUpdates = [
    'title',
    'image',
    'backdropImages',
    'castCrew',
    'language',
    'genre',
    'director',
    'cast',
    'description',
    'synopsis',
    'contentWarning',
    'duration',
    'rating',
    'releaseDate',
    'endDate',
    'isPublished',
    'format',
  ];
  const sanitizedBody = Object.keys(req.body || {}).reduce((acc, key) => {
    if (allowedUpdates.includes(key)) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});
  const updates = Object.keys(sanitizedBody);

  if (!updates.length) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const movie = await Movie.findById(_id);
    if (!movie) return res.sendStatus(404);
    updates.forEach((update) => (movie[update] = sanitizedBody[update]));
    if (updates.includes('backdropImages')) movie.markModified('backdropImages');
    if (updates.includes('castCrew')) movie.markModified('castCrew');
    await movie.save();
    return res.send(movie);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Delete movie by id
router.delete('/movies/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const movie = await Movie.findByIdAndDelete(_id);
    return !movie ? res.sendStatus(404) : res.send(movie);
  } catch (e) {
    return res.sendStatus(400);
  }
});

// Movies User modeling (Get Movies Suggestions)
router.get('/movies/usermodeling/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const cinemasUserModeled = await userModeling.moviesUserModeling(username);
    res.send(cinemasUserModeled);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all reviews (Admin only)
router.get('/movies/reviews/all', auth.enhance, async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.send(reviews);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete a review (Admin only)
router.delete('/movies/reviews/:reviewId', auth.enhance, async (req, res) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) return res.sendStatus(404);

    // Recalculate movie rating (only from Approved reviews)
    const movieId = review.movieId;
    const approvedReviews = await Review.find({ movieId, status: 'Approved' });
    const movie = await Movie.findById(movieId);
    if (movie) {
      if (approvedReviews.length > 0) {
        const avgRating = approvedReviews.reduce((acc, cur) => acc + cur.rating, 0) / approvedReviews.length;
        movie.rating = parseFloat(avgRating.toFixed(1));
      } else {
        movie.rating = 0;
      }
      await movie.save();
    }

    res.send({ message: 'Review deleted', movie });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update a review (Admin only)
router.put('/movies/reviews/:reviewId', auth.enhance, async (req, res) => {
  const { reviewId } = req.params;
  const { status, isHighlighted } = req.body;
  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.sendStatus(404);

    if (status) review.status = status;
    if (isHighlighted !== undefined) review.isHighlighted = isHighlighted;

    await review.save();

    // Recalculate movie rating only if status changed to/from Approved
    const movieId = review.movieId;
    const reviews = await Review.find({ movieId, status: 'Approved' });
    const movie = await Movie.findById(movieId);
    if (movie) {
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;
        movie.rating = parseFloat(avgRating.toFixed(1));
      } else {
        movie.rating = 0;
      }
      await movie.save();
    }

    res.send({ review, movie });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
