import { GET_MOVIES, SELECT_MOVIE,GET_SUGGESTIONS } from '../types';
import { setAlert } from './alert';

export const uploadMovieImage = (id, image) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const data = new FormData();
    data.append('file', image);
    const url = '/movies/photo/' + id;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data
    });
    const responseText = await response.text();
    let responseData = {};
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      responseData = {};
    }
    if (response.ok) {
      dispatch(setAlert('Image Uploaded', 'success', 5000));
    }
    if (responseData.error) {
      dispatch(setAlert(responseData.error.message, 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const uploadMovieBackdrops = (id, files) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const data = new FormData();
    (files || []).forEach(file => data.append('files', file));
    const url = '/movies/backdrops/' + id;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data
    });
    const responseText = await response.text();
    let responseData = {};
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      responseData = {};
    }
    if (response.ok) {
      dispatch(setAlert('Backdrop images uploaded', 'success', 5000));
    } else {
      dispatch(
        setAlert(
          (responseData && responseData.error && responseData.error.message) ||
            responseData.error ||
            'Backdrop upload failed',
          'error',
          5000
        )
      );
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const uploadMovieCastCrewImages = (id, files) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const data = new FormData();
    (files || []).forEach(file => data.append('files', file));
    const url = '/movies/cast-crew-images/' + id;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data
    });
    const responseText = await response.text();
    let responseData = {};
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      responseData = {};
    }
    if (response.ok) {
      dispatch(setAlert('Cast & crew images uploaded', 'success', 5000));
    } else {
      dispatch(
        setAlert(
          (responseData && responseData.error && responseData.error.message) ||
            responseData.error ||
            'Cast/Crew image upload failed',
          'error',
          5000
        )
      );
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const getMovies = (all = false) => async dispatch => {
  try {
    const url = all ? '/movies?all=true' : '/movies';
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const movies = await response.json();
    if (response.ok) {
      dispatch({ type: GET_MOVIES, payload: movies });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const onSelectMovie = movie => ({
  type: SELECT_MOVIE,
  payload: movie
});

export const getMovie = id => async dispatch => {
  try {
    const url = '/movies/' + id;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const movie = response.ok ? await response.json() : null;
    if (response.ok && movie) {
      dispatch({ type: SELECT_MOVIE, payload: movie });
    } else {
      dispatch(setAlert('Movie not found or server error', 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const getMovieSuggestion = id => async dispatch => {
  try {
    const url = '/movies/usermodeling/' + id;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const movies = await response.json();
    if (response.ok) {
      dispatch({ type: GET_SUGGESTIONS, payload: movies });
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const addMovie = (image, newMovie, backdropFiles = [], castCrewFiles = []) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/movies';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMovie)
    });
    const movie = await response.json();
    if (response.ok) {
      dispatch(setAlert('Movie have been saved!', 'success', 5000));
      if (image) await dispatch(uploadMovieImage(movie._id, image));
      if (backdropFiles.length)
        await dispatch(uploadMovieBackdrops(movie._id, backdropFiles));
      if (castCrewFiles.length)
        await dispatch(uploadMovieCastCrewImages(movie._id, castCrewFiles));
      dispatch(getMovies());
    } else {
      dispatch(
        setAlert(
          (movie && movie.error && movie.error.message) ||
            movie.message ||
            'Unable to save movie',
          'error',
          5000
        )
      );
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const updateMovie = (
  movieId,
  movie,
  image,
  backdropFiles = [],
  castCrewFiles = []
) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/movies/' + movieId;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    const responseText = await response.text();
    let responseData = {};
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      responseData = {};
    }
    if (response.ok) {
      dispatch(onSelectMovie(null));
      dispatch(setAlert('Movie have been saved!', 'success', 5000));
      if (image) await dispatch(uploadMovieImage(movieId, image));
      if (backdropFiles.length)
        await dispatch(uploadMovieBackdrops(movieId, backdropFiles));
      if (castCrewFiles.length)
        await dispatch(uploadMovieCastCrewImages(movieId, castCrewFiles));
      dispatch(getMovies());
    } else {
      const rawError =
        typeof responseText === 'string' && responseText.trim().length
          ? responseText
          : '';
      dispatch(
        setAlert(
          (responseData && responseData.error && responseData.error.message) ||
            responseData.message ||
            rawError ||
            'Unable to update movie',
          'error',
          5000
        )
      );
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

export const removeMovie = movieId => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/movies/' + movieId;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      dispatch(getMovies());
      dispatch(onSelectMovie(null));
      dispatch(setAlert('Movie have been Deleted!', 'success', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};
