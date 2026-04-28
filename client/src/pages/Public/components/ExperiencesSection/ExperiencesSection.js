import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getExperiences } from '../../../../store/actions';

const EXPERIENCES = [
  {
    id: 'imax',
    title: 'IMAX',
    subtitle: 'Experience the Extraordinary',
    desc: 'The most immersive large format cinema experience with crystal-clear images and heart-pounding sound.',
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    accent: '#00bcd4',
    icon: '🎬',
  },
  {
    id: '4dx',
    title: '4DX',
    subtitle: 'Feel Every Frame',
    desc: 'Motion seats, wind, rain, scents and more — cinema that you don\'t just watch, you feel.',
    gradient: 'linear-gradient(135deg, #200122 0%, #6f0000 100%)',
    accent: '#ff4444',
    icon: '💥',
  },
  {
    id: 'gold',
    title: 'GOLD',
    subtitle: 'Luxury Redefined',
    desc: 'Plush recliner seats, premium F&B service, and an exclusive lounge — cinema like never before.',
    gradient: 'linear-gradient(135deg, #1a1100 0%, #3d2800 50%, #8B6914 100%)',
    accent: '#b72429',
    icon: '✨',
  },
  {
    id: 'pxl',
    title: 'PXL',
    subtitle: 'Laser Precision',
    desc: 'State-of-the-art laser projection with Dolby Atmos sound for the sharpest picture ever projected.',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    accent: '#7c4dff',
    icon: '🔮',
  },
];

const useStyles = makeStyles(theme => ({
  section: {
    width: '100%',
    padding: '60px 5%',
    backgroundColor: '#f8fafc',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#0f172a',
    position: 'relative',
    '&::after': {
      content: '""',
      display: 'block',
      marginTop: '8px',
      width: '50px',
      height: '3px',
      background: '#b72429',
      borderRadius: '2px',
    }
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  card: {
    borderRadius: '14px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    minHeight: '240px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '24px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 20px 50px rgba(15,23,42,0.2)',
    },
    '&:hover $cardOverlay': {
      opacity: 1,
    }
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.25)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 1,
  },
  cardContent: {
    position: 'relative',
    zIndex: 2,
  },
  cardIcon: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '2.5rem',
    zIndex: 2,
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
  },
  cardTitle: {
    fontWeight: 900,
    fontSize: '2rem',
    letterSpacing: '3px',
    lineHeight: 1,
    marginBottom: '4px',
  },
  cardSubtitle: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    opacity: 0.8,
    marginBottom: '10px',
  },
  cardDesc: {
    fontSize: '0.82rem',
    lineHeight: 1.5,
    opacity: 0.75,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  accentLine: {
    width: '30px',
    height: '2px',
    borderRadius: '1px',
    marginBottom: '12px',
  },
  [theme.breakpoints.down('md')]: {
    grid: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    }
  },
  [theme.breakpoints.down('sm')]: {
    grid: {
      gridTemplateColumns: '1fr',
    },
    section: {
      padding: '40px 20px'
    }
  }
}));

function ExperiencesSection({ experiences, getExperiences }) {
  const classes = useStyles();
  React.useEffect(() => {
    getExperiences();
  }, [getExperiences]);
  const list = experiences && experiences.length ? experiences : EXPERIENCES;
  return (
    <section className={classes.section}>
      <div className={classes.header}>
        <Typography className={classes.sectionTitle} variant="h2">
          The PVR Experience
        </Typography>
      </div>
      <div className={classes.grid}>
        {list.map(exp => {
          const expKey = exp.key || exp.id;
          return (
          <Link key={expKey} to={`/experience/${expKey}`} style={{ textDecoration: 'none' }}>
            <div
              className={classes.card}
              style={{
                background: exp.image
                  ? `linear-gradient(to bottom, rgba(0,0,0,.25), rgba(0,0,0,.75)), url("${encodeURI(
                      exp.image
                    )}") center/cover no-repeat`
                  : exp.gradient
              }}
            >
              <div className={classes.cardOverlay} />
              <span className={classes.cardIcon}>{exp.icon}</span>
              <div className={classes.cardContent}>
                <div
                  className={classes.accentLine}
                  style={{ backgroundColor: exp.accent }}
                />
                <Typography
                  className={classes.cardTitle}
                  style={{ color: exp.accent }}
                >
                  {exp.title}
                </Typography>
                <Typography
                  className={classes.cardSubtitle}
                  style={{ color: exp.accent }}
                >
                  {exp.subtitle}
                </Typography>
                <Typography className={classes.cardDesc} style={{ color: '#fff' }}>
                {exp.description || exp.desc}
                </Typography>
              </div>
            </div>
          </Link>
        );
        })}
      </div>
    </section>
  );
}

const mapStateToProps = ({ experienceState }) => ({
  experiences: experienceState.experiences || [],
});

export default connect(mapStateToProps, { getExperiences })(ExperiencesSection);
