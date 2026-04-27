import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import { getExperiences } from '../../../store/actions';

const EXPERIENCES = {
  imax: {
    title: 'IMAX',
    subtitle: 'Experience the Extraordinary',
    description:
      'IMAX delivers larger-than-life visuals and precision-tuned sound that pulls you into every scene. Designed for premium immersion with giant screens and optimized projection.',
    features: ['Giant immersive screen', 'Crystal-clear projection', 'Powerful surround sound'],
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  },
  '4dx': {
    title: '4DX',
    subtitle: 'Feel Every Frame',
    description:
      '4DX brings motion seats and environmental effects like wind, rain, scent, and lighting. It transforms action and adventure into a sensory event.',
    features: ['Motion-enabled seats', 'Environmental effects', 'Action synchronized experience'],
    gradient: 'linear-gradient(135deg, #200122 0%, #6f0000 100%)',
  },
  gold: {
    title: 'GOLD',
    subtitle: 'Luxury Redefined',
    description:
      'GOLD offers a premium lounge-inspired cinema format with plush seating, personalized service, and elevated comfort for a truly luxurious movie night.',
    features: ['Luxury recliners', 'Premium service', 'Exclusive ambience'],
    gradient: 'linear-gradient(135deg, #1a1100 0%, #3d2800 50%, #8B6914 100%)',
  },
  pxl: {
    title: 'PXL',
    subtitle: 'Laser Precision',
    description:
      'PXL combines high-brightness laser projection with advanced audio engineering to deliver deep contrast, vivid color, and sharp cinematic detail.',
    features: ['Laser projection', 'Enhanced brightness and contrast', 'Immersive audio'],
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
  },
};

const useStyles = makeStyles(theme => ({
  hero: {
    minHeight: '75vh',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(10, 0, 8),
  },
  card: {
    background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: theme.spacing(5),
    backdropFilter: 'blur(2px)',
  },
  title: {
    fontWeight: 800,
    fontSize: '2.4rem',
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    fontWeight: 600,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: theme.spacing(2),
  },
  description: {
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 1.7,
    marginBottom: theme.spacing(3),
  },
  feature: {
    color: 'rgba(255,255,255,0.9)',
    marginBottom: theme.spacing(1),
  },
  actions: {
    marginTop: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(2),
  },
}));

function ExperiencePage({ match, experiences, getExperiences }) {
  const classes = useStyles();
  React.useEffect(() => {
    if (!experiences || !experiences.length) getExperiences();
  }, [experiences, getExperiences]);

  const apiExperience =
    experiences && experiences.find(item => item.key === match.params.id);
  const staticExperience = EXPERIENCES[match.params.id];
  const exp = apiExperience || staticExperience;

  if (!exp) {
    return (
      <Container style={{ paddingTop: 120, color: '#fff' }}>
        <Typography variant="h3">Experience not found</Typography>
      </Container>
    );
  }

  return (
    <div
      className={classes.hero}
      style={{
        background: exp.image
          ? `linear-gradient(to right, rgba(0,0,0,.75), rgba(0,0,0,.45)), url("${encodeURI(
              exp.image
            )}") center/cover no-repeat`
          : exp.gradient
      }}
    >
      <Container maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <div className={classes.card}>
              <Typography className={classes.title}>{exp.title}</Typography>
              <Typography className={classes.subtitle}>{exp.subtitle}</Typography>
              <Typography className={classes.description}>{exp.description}</Typography>
              {(exp.features || []).map(feature => (
                <Typography key={feature} className={classes.feature} variant="body1">
                  - {feature}
                </Typography>
              ))}
              <div className={classes.actions}>
                <Button
                  component={Link}
                  to="/cinemas"
                  variant="contained"
                  color="secondary"
                >
                  Explore Cinemas
                </Button>
                <Button component={Link} to="/" variant="outlined" style={{ color: '#fff', borderColor: '#fff' }}>
                  Back Home
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

const mapStateToProps = ({ experienceState }) => ({
  experiences: experienceState.experiences || [],
});

export default connect(mapStateToProps, { getExperiences })(ExperiencePage);
