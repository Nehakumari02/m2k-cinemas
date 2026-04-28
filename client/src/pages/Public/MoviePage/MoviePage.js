// @ts-nocheck
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Typography, Grid } from '@material-ui/core';
import MovieBanner from '../components/MovieBanner/MovieBanner';
import { getMovie, onSelectMovie } from '../../../store/actions';

class MoviePage extends Component {
  componentDidMount() {
    this.props.getMovie(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.props.onSelectMovie(null);
  }

  render() {
    const { movie } = this.props;
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

            {!!backdropImages.length && (
              <>
                <Typography
                  variant="h4"
                  style={{ fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
                  Backdrops
                </Typography>
                <Grid container spacing={2}>
                  {backdropImages.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`${image}-${index}`}>
                      <div
                        style={{
                          borderRadius: 12,
                          overflow: 'hidden',
                          border: '1px solid rgba(15,23,42,0.1)',
                          boxShadow: '0 8px 20px rgba(15,23,42,0.1)',
                        }}>
                        <img
                          src={normalizeImage(image)}
                          alt={`Backdrop ${index + 1}`}
                          style={{
                            width: '100%',
                            height: 210,
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Container>
        )}
      </>
    );
  }
}

MoviePage.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired
};

const mapStateToProps = ({ movieState }) => ({
  movie: movieState.selectedMovie
});

const mapDispatchToProps = { getMovie, onSelectMovie };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoviePage);
