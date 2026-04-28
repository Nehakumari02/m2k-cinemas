export default theme => ({
  movieCard: {
    position: 'relative',
    minHeight: 340,
    width: '100%',
    maxWidth: 920,
    color: '#0f172a',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    transition: 'all 0.4s',
    '&:hover': {
      transform: 'scale(1.02)',
      transition: 'all 0.4s'
    }
  },
  infoSection: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundBlendMode: 'multiply',
    background: 'linear-gradient(to right, rgba(255,255,255,0.96) 55%, rgba(255,255,255,0.55) 100%)',
    zIndex: 2,
    borderRadius: 10
  },
  movieHeader: {
    position: 'relative',
    padding: theme.spacing(3),
    height: '40%',
    width: '60%'
  },
  movieTitle: {
    fontSize: '25px',
    fontWeight: 400,
    textTransform: 'capitalize'
  },
  director: {
    color: '#475569',
    fontWeight: '500',
    fontSize: '16px',
    marginTop: theme.spacing(1)
  },
  duration: {
    display: 'inline-block',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    border: '1px solid rgba(15,23,42,0.15)'
  },
  genre: {
    display: 'inline-block',
    color: '#64748b',
    marginLeft: theme.spacing(2)
  },
  description: {
    padding: theme.spacing(3),
    width: '55%'
  },
  descriptionText: {
    color: '#334155'
  },
  footer: {
    height: '10%',
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(3)
  },
  icons: {
    display: 'inline-block',
    cursor: 'pointer',
    color: '#64748b',
    margin: theme.spacing(0, 1),
    transition: 'all 0.3s',
    '&:hover': {
      color: '#0f172a',
      transform: 'scale(1.25)',
      transition: 'all 0.3s',
      transitionDelay: '0.15s'
    }
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    height: '100%',
    right: 0,
    backgroundSize: 'cover !important',
    borderRadius: 11,
    width: '80%',
    backgroundPosition: '-100% 10% !important'
  },

  [theme.breakpoints.down('sm')]: {
    movieCard: {
      width: '100%',
      margin: '0 auto',
      height: 'auto'
    },
    blurBackground: {
      width: '100%',
      backgroundPosition: '50% 50% !important'
    },
    movieHeader: {
      width: '100%',
      marginTop: theme.spacing(3)
    },
    description: {
      width: '100%',
      paddingTop: theme.spacing(1)
    },
    infoSection: {
      background:
        'linear-gradient(to top, rgba(255,255,255,0.95) 55%, transparent 100%)',
      zIndex: 2,
      borderRadius: 10
    }
  }
});
