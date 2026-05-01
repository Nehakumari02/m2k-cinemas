// @ts-nocheck
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Typography, Grid, Box, TextField, Button, Paper, Divider } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import MovieBanner from '../components/MovieBanner/MovieBanner';
import { getMovie, onSelectMovie } from '../../../store/actions';
import { setAlert } from '../../../store/actions/alert';
import { setAuthHeaders } from '../../../utils';

class MoviePage extends Component {
  state = {
    reviews: [],
    rating: 0,
    comment: '',
    loadingReviews: true,
  };

  componentDidMount() {
    const movieId = this.props.match.params.id;
    this.props.getMovie(movieId);
    this.fetchReviews(movieId);
  }

  componentWillUnmount() {
    this.props.onSelectMovie(null);
  }

  fetchReviews = async (movieId) => {
    try {
      const response = await fetch(`/movies/${movieId}/reviews`);
      const data = await response.json();
      this.setState({ reviews: data, loadingReviews: false });
    } catch (e) {
      console.error('Error fetching reviews:', e);
      this.setState({ loadingReviews: false });
    }
  };

  submitReview = async () => {
    const { movie, user } = this.props;
    const { rating, comment } = this.state;

    if (!user) return this.props.setAlert('Please login to write a review', 'error');
    if (rating === 0) return this.props.setAlert('Please select a rating', 'warning');
    if (!comment.trim()) return this.props.setAlert('Please write a comment', 'warning');

    try {
      const response = await fetch(`/movies/${movie._id}/reviews`, {
        method: 'POST',
        headers: {
          ...setAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating,
          comment,
          userName: user.name || user.username
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.props.setAlert('Review submitted successfully!', 'success');
        this.setState(prev => ({
          reviews: [data.review, ...prev.reviews],
          rating: 0,
          comment: ''
        }));
        this.props.getMovie(movie._id); // Refresh movie data for average rating
      } else {
        this.props.setAlert(data.message || 'Error submitting review', 'error');
      }
    } catch (e) {
      console.error('Error submitting review:', e);
      this.props.setAlert('Error connecting to server', 'error');
    }
  };

  render() {
    const { movie, user } = this.props;
    const { reviews, rating, comment } = this.state;
    const normalizeImage = value => {
      if (!value) return '';
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return encodeURI(value);
      }
      return encodeURI(value.startsWith('/') ? value : `/${value}`);
    };
    const castCrew = Array.isArray(movie && movie.castCrew) ? movie.castCrew : [];
    const castMembers = castCrew.filter(
      member => String(member.role || '').toLowerCase() === 'cast'
    );
    const crewMembers = castCrew.filter(
      member => String(member.role || '').toLowerCase() !== 'cast'
    );
    const backdropImages = Array.isArray(movie && movie.backdropImages)
      ? movie.backdropImages
      : [];

    return (
      <>
        {movie && <MovieBanner movie={movie} fullDescription />}
        {movie && (
          <Container maxWidth="lg" style={{ paddingTop: 24, paddingBottom: 48 }}>
            {!!castMembers.length && (
              <>
                <Typography
                  variant="h4"
                  style={{ fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
                  Cast
                </Typography>
                <Grid container spacing={2} style={{ marginBottom: 28 }}>
                  {castMembers.map((member, index) => {
                    const memberImage = member.image
                      ? normalizeImage(member.image)
                      : 'https://source.unsplash.com/featured/?portrait';
                    return (
                      <Grid item xs={6} sm={4} md={3} lg={2} key={`${member.name || 'person'}-${index}`}>
                        <div
                          style={{
                            background: '#fff',
                            border: '1px solid rgba(15,23,42,0.1)',
                            borderRadius: 12,
                            overflow: 'hidden',
                            textAlign: 'center',
                            boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
                          }}>
                          <img
                            src={memberImage}
                            alt={member.name || 'Cast or crew'}
                            style={{
                              width: '100%',
                              height: 180,
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                          <div style={{ padding: 10 }}>
                            <Typography
                              variant="body1"
                              style={{ fontWeight: 700, color: '#0f172a' }}>
                              {member.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" style={{ color: '#64748b' }}>
                              Cast
                            </Typography>
                          </div>
                        </div>
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            )}

            {!!crewMembers.length && (
              <>
                <Typography
                  variant="h4"
                  style={{ fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
                  Crew
                </Typography>
                <Grid container spacing={2} style={{ marginBottom: 28 }}>
                  {crewMembers.map((member, index) => {
                    const memberImage = member.image
                      ? normalizeImage(member.image)
                      : 'https://source.unsplash.com/featured/?portrait';
                    return (
                      <Grid item xs={6} sm={4} md={3} lg={2} key={`${member.role || 'crew'}-${member.name || 'person'}-${index}`}>
                        <div
                          style={{
                            background: '#fff',
                            border: '1px solid rgba(15,23,42,0.1)',
                            borderRadius: 12,
                            overflow: 'hidden',
                            textAlign: 'center',
                            boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
                          }}>
                          <img
                            src={memberImage}
                            alt={member.name || 'Crew'}
                            style={{
                              width: '100%',
                              height: 180,
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                          <div style={{ padding: 10 }}>
                            <Typography
                              variant="body1"
                              style={{ fontWeight: 700, color: '#0f172a' }}>
                              {member.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" style={{ color: '#64748b' }}>
                              {member.role || 'Crew'}
                            </Typography>
                          </div>
                        </div>
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            )}
            
            {/* Review Section */}
            <Grid container spacing={4} style={{ marginTop: 40 }}>
              <Grid item xs={12} md={7}>
                <Typography variant="h4" style={{ fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>
                  User Reviews ({reviews.length})
                </Typography>
                
                {reviews.length ? (
                  reviews.map((rev, i) => (
                    <Paper key={i} elevation={0} style={{ padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '16px' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" style={{ fontWeight: 700, color: '#1e293b' }}>
                          {rev.userName}
                        </Typography>
                        <Rating value={rev.rating} readOnly size="small" />
                      </Box>
                      <Typography variant="caption" style={{ color: '#94a3b8', display: 'block', marginBottom: '12px' }}>
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </Typography>
                      <Typography variant="body1" style={{ color: '#475569', lineHeight: 1.6 }}>
                        {rev.comment}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Box py={4} textAlign="center" style={{ background: '#f8fafc', borderRadius: 16 }}>
                    <Typography color="textSecondary">No reviews yet. Be the first to review!</Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper elevation={0} style={{ padding: '32px', borderRadius: '24px', background: '#f8fafc', position: 'sticky', top: '100px' }}>
                  <Typography variant="h5" style={{ fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
                    Write a Review
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ marginBottom: 24 }}>
                    Share your experience with other moviegoers.
                  </Typography>
                  
                  <Box mb={3}>
                    <Typography variant="subtitle2" style={{ marginBottom: 8, fontWeight: 700 }}>Your Rating</Typography>
                    <Rating 
                      value={rating} 
                      onChange={(e, v) => this.setState({ rating: v })} 
                      size="large"
                    />
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Write your thoughts about the movie..."
                    value={comment}
                    onChange={e => this.setState({ comment: e.target.value })}
                    style={{ background: '#fff', borderRadius: 12, marginBottom: 24 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={this.submitReview}
                    style={{ borderRadius: 12, padding: '14px', fontWeight: 800, background: '#b72429' }}
                  >
                    Submit Review
                  </Button>

                  {!user && (
                    <Typography variant="caption" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: '#ef4444' }}>
                      * You must be logged in to post a review.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>

            {/* Backdrops Section */}
            {!!backdropImages.length && (
              <Box mt={8}>
                <Typography variant="h4" style={{ fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
                  Backdrops
                </Typography>
                <Grid container spacing={2}>
                  {backdropImages.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`${image}-${index}`}>
                      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(15,23,42,0.1)' }}>
                        <img src={normalizeImage(image)} alt="Backdrop" style={{ width: '100%', height: 210, objectFit: 'cover' }} />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Container>
        )}
      </>
    );
  }
}

MoviePage.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  user: PropTypes.object
};

const mapStateToProps = ({ movieState, authState }) => ({
  movie: movieState.selectedMovie,
  user: authState.user
});

const mapDispatchToProps = { getMovie, onSelectMovie, setAlert };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoviePage);
