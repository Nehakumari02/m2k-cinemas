import { GET_MOVIES, SELECT_MOVIE, GET_SUGGESTIONS, TOGGLE_MOVIE_INTEREST } from '../types';

const initialState = {
  movies: [],
  randomMovie: null,
  latestMovies: [],
  nowShowing: [],
  comingSoon: [],
  selectedMovie: null,
  suggested:[]
};

const getMovies = (state, payload) => {
  const latestMovies = payload
    .sort((a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate))
    .slice(0, 5);

  const nowShowing = payload.filter(
    movie =>
      new Date(movie.endDate) >= new Date() &&
      new Date(movie.releaseDate) < new Date()
  );

  const comingSoon = payload.filter(
    movie => new Date(movie.releaseDate) > new Date()
  );

  return {
    ...state,
    movies: payload,
    randomMovie: payload[Math.floor(Math.random() * payload.length)],
    latestMovies,
    nowShowing,
    comingSoon
  };
};

const onSelectMovie = (state, payload) => ({
  ...state,
  selectedMovie: payload
});

const getMovieSuggestions = (state, payload) =>({
  ...state,
  suggested: payload
})

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MOVIES:
      return getMovies(state, payload);
    case SELECT_MOVIE:
      return onSelectMovie(state, payload);
    case GET_SUGGESTIONS:
      return getMovieSuggestions(state, payload);
    case TOGGLE_MOVIE_INTEREST:
      return {
        ...state,
        movies: state.movies.map(movie => movie._id === payload._id ? payload : movie),
        comingSoon: state.comingSoon.map(movie => movie._id === payload._id ? payload : movie),
        nowShowing: state.nowShowing.map(movie => movie._id === payload._id ? payload : movie),
        selectedMovie: state.selectedMovie && state.selectedMovie._id === payload._id ? payload : state.selectedMovie
      };
    default:
      return state;
  }
};
