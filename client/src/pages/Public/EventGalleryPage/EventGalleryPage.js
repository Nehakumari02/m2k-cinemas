import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Button, CircularProgress, Box, Dialog, IconButton } from '@material-ui/core';
import { ArrowBack, Close as CloseIcon, PhotoLibrary, ZoomIn } from '@material-ui/icons';
import useStyles from './styles';
import { normalizeImage } from '../../../utils/imageUrl';

const EventGalleryPage = ({ match, history }) => {
  const classes = useStyles();
  const [selectedImage, setSelectedImage] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const eventId = match.params.id;

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;

    (async () => {
      setLoading(true);
      setEvent(null);
      try {
        const res = await fetch(`/events/${eventId}`);
        if (cancelled) return;
        if (res.ok) {
          setEvent(await res.json());
        } else {
          setEvent(null);
        }
      } catch {
        if (!cancelled) setEvent(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  if (loading) {
    return (
      <div className={classes.root}>
        <Container maxWidth="lg" className={classes.loader}>
          <CircularProgress size={60} style={{ color: '#b72429' }} />
        </Container>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={classes.root}>
        <Container maxWidth="lg">
          <Button className={classes.backButton} startIcon={<ArrowBack />} onClick={() => history.push('/events')}>
            Back to Events
          </Button>
          <Box className={classes.emptyState}>
            <Typography variant="h5">Event not found.</Typography>
          </Box>
        </Container>
      </div>
    );
  }

  const gallery = Array.isArray(event.gallery) ? event.gallery.filter(Boolean) : [];
  const heroImage = event.image;

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Button className={classes.backButton} startIcon={<ArrowBack />} onClick={() => history.push('/events')}>
          Back to Events
        </Button>

        <div className={classes.eventHeroWrap}>
          <section className={classes.eventHero}>
            {heroImage && (
              <div className={classes.eventHeroImageWrap}>
                <img
                  src={normalizeImage(heroImage)}
                  alt={event.title}
                  className={classes.eventHeroImage}
                />
              </div>
            )}
            <div className={classes.eventHeroBody}>
              <Typography className={classes.eventHeroTitle} component="h1" variant="h5">
                {event.title}
              </Typography>
              {event.date && (
                <Typography className={classes.eventHeroDate} variant="subtitle2">
                  {event.date}
                </Typography>
              )}
              {event.description && (
                <Typography className={classes.eventHeroDescription} variant="body2">
                  {event.description}
                </Typography>
              )}
            </div>
          </section>
        </div>

        <Typography className={classes.gallerySectionTitle} component="h2" variant="h5">
          Photo <span className={classes.highlight}>Gallery</span>
        </Typography>

        {gallery.length === 0 ? (
          <Box className={classes.emptyState}>
            <PhotoLibrary style={{ fontSize: '4rem', marginBottom: 16 }} />
            <Typography variant="h6">No additional photos yet.</Typography>
            <Typography variant="body2">More gallery images will appear here when they are added.</Typography>
          </Box>
        ) : (
          <div className={classes.galleryContainer}>
            <Grid container spacing={4}>
              {gallery.map((imgUrl, index) => (
                <Grid item xs={12} sm={6} md={4} key={`${imgUrl}-${index}`}>
                  <div className={classes.imageCard} onClick={() => setSelectedImage(imgUrl)} role="presentation">
                    <img src={normalizeImage(imgUrl)} alt={`${event.title} ${index + 1}`} className={classes.image} />
                    <div className={classes.imageOverlay}>
                      <ZoomIn className={classes.searchIcon} />
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        <Dialog
          open={Boolean(selectedImage)}
          onClose={() => setSelectedImage(null)}
          maxWidth="lg"
          classes={{ paper: classes.dialogPaper }}
        >
          {selectedImage && (
            <>
              <IconButton className={classes.closeButton} onClick={() => setSelectedImage(null)}>
                <CloseIcon />
              </IconButton>
              <img src={normalizeImage(selectedImage)} alt="Fullscreen view" className={classes.fullImage} />
            </>
          )}
        </Dialog>
      </Container>
    </div>
  );
};

export default EventGalleryPage;
