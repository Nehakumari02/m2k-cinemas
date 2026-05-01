import React, { useEffect } from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, Button, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { getEvents } from '../../../store/actions';

const EventsPage = ({ getEvents, eventState }) => {
  const { events, loading } = eventState;

  useEffect(() => {
    window.scrollTo(0, 0);
    getEvents();
  }, [getEvents]);

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '100px 0' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" style={{ fontWeight: 800, textAlign: 'center', marginBottom: '20px', color: '#111827' }}>
          Upcoming <span style={{ color: '#b72429' }}>Events</span>
        </Typography>
        <Typography variant="h6" style={{ textAlign: 'center', color: '#6b7280', marginBottom: '60px' }}>
          Experience more than just a movie. Join us for exclusive premieres, fan fests, and more.
        </Typography>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress style={{ color: '#b72429' }} />
          </div>
        ) : (
          <Grid container spacing={4}>
            {events.map((event, i) => (
              <Grid item key={i} xs={12} md={4}>
                <Card style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                  <CardMedia image={event.image} style={{ height: 200 }} />
                  <CardContent style={{ padding: '24px' }}>
                    <Typography variant="overline" style={{ color: '#b72429', fontWeight: 700 }}>{event.date}</Typography>
                    <Typography variant="h5" style={{ fontWeight: 800, margin: '8px 0' }}>{event.title}</Typography>
                    <Typography variant="body2" style={{ color: '#6b7280', marginBottom: '20px' }}>{event.description}</Typography>
                    <Button variant="outlined" style={{ borderColor: '#b72429', color: '#b72429', fontWeight: 700 }}>Interested</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

const mapStateToProps = ({ eventState }) => ({ eventState });
export default connect(mapStateToProps, { getEvents })(EventsPage);
