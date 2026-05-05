import React, { useEffect } from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, Button, CircularProgress, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import { History, Event as EventIcon, Update } from '@material-ui/icons';
import moment from 'moment';
import { getEvents } from '../../../store/actions';
import useStyles from './styles';

const EventsPage = ({ getEvents, eventState }) => {
  const classes = useStyles();
  const { events, loading } = eventState;

  useEffect(() => {
    window.scrollTo(0, 0);
    getEvents();
  }, [getEvents]);

  const categorizeEvents = () => {
    const today = moment().startOf('day');
    // More comprehensive list of formats to handle different user inputs
    const formats = [
      'MMMM D, YYYY', 
      'D MMMM YYYY', 
      'MMMM D YYYY', 
      'D MMMM, YYYY',
      'YYYY-MM-DD', 
      'DD-MM-YYYY',
      'MM/DD/YYYY',
      'DD/MM/YYYY'
    ];
    
    return {
      past: events.filter(event => {
        const m = moment(event.date, formats);
        return m.isValid() && m.isBefore(today);
      }),
      current: events.filter(event => {
        const m = moment(event.date, formats);
        return m.isValid() && m.isSame(today, 'day');
      }),
      comingSoon: events.filter(event => {
        const m = moment(event.date, formats);
        return m.isValid() && m.isAfter(today);
      }),
    };
  };

  const { past, current, comingSoon } = categorizeEvents();

  const EventCard = ({ event, isPast }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={`${classes.card} ${isPast ? classes.pastEvent : ''}`}>
        <div className={classes.mediaWrapper}>
          <div className={classes.dateOverlay}>{event.date}</div>
          <CardMedia 
            className={classes.media} 
            image={event.image} 
            title={event.title}
          />
        </div>
        <CardContent className={classes.cardContent}>
          <Typography className={classes.eventTitle} variant="h5">
            {event.title}
          </Typography>
          <Typography className={classes.eventDescription} variant="body2">
            {event.description}
          </Typography>
          <Button className={classes.button} fullWidth>
            {isPast ? 'View Gallery' : 'Interested'}
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );

  const Section = ({ title, icon: Icon, data, isPast }) => {
    if (data.length === 0) return null;
    
    return (
      <div className={classes.section}>
        <div className={classes.sectionHeader}>
          <Typography className={classes.sectionTitle}>
            <Icon className={classes.sectionIcon} />
            {title}
          </Typography>
        </div>
        <Grid container spacing={4}>
          {data.map((event, i) => (
            <EventCard key={event._id || i} event={event} isPast={isPast} />
          ))}
        </Grid>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <header className={classes.header}>
          <Typography className={classes.title} variant="h2">
            Experience <span className={classes.highlight}>Beyond</span> Movies
          </Typography>
          <Typography className={classes.subtitle}>
            From exclusive premieres to fan conventions, discover events that bring your favorite stories to life.
          </Typography>
        </header>

        {loading ? (
          <div className={classes.loader}>
            <CircularProgress size={60} style={{ color: '#b72429' }} />
          </div>
        ) : (
          <>
            <Section 
              title="Happening Today" 
              icon={Update} 
              data={current} 
            />
            
            <Section 
              title="Coming Soon" 
              icon={EventIcon} 
              data={comingSoon} 
            />
            
            <Section 
              title="Past Events" 
              icon={History} 
              data={past} 
              isPast
            />

            {!current.length && !comingSoon.length && !past.length && (
              <Box className={classes.emptyState}>
                <EventIcon style={{ fontSize: '4rem', marginBottom: 16 }} />
                <Typography variant="h6">No events scheduled at the moment.</Typography>
                <Typography variant="body2">Check back later for exciting updates!</Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

const mapStateToProps = ({ eventState }) => ({ eventState });
export default connect(mapStateToProps, { getEvents })(EventsPage);
