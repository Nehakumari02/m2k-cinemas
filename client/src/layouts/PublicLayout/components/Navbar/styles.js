export default theme => ({
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    padding: '0 32px',
    height: '64px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    transform: 'translate3d(0,0,0)',
    backfaceVisibility: 'hidden',
    zIndex: 999,
    transition: 'background 300ms ease-in',
    background: 'rgba(14,14,20,0.72)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(183,36,41,0.10)'
  },
  navbarColor: {
    background: 'rgb(14,14,20)',
    borderBottom: '1px solid rgba(183,36,41,0.18)',
    transition: 'all 200ms ease-out'
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingTop: '.15rem',
    paddingBottom: '.15rem',
    marginRight: '20px',
    fontSize: '1.5rem',
    lineHeight: 'inherit',
    whiteSpace: 'nowrap',
    textDecoration: 'none'
  },
  logo: {
    maxHeight: '2.4rem',
    width: 'auto',
    fontSize: '1.8rem',
    fontWeight: 800,
    letterSpacing: '2px',
    color: '#b72429',
    textTransform: 'uppercase'
  },
  navLinks: {
    marginLeft: 'auto',
    display: 'flex'
  },
  navLink: {
    position: 'relative',
    color: 'rgba(255,255,255,0.88)',
    padding: '0 .5rem',
    margin: '0 1rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    textDecoration: 'none',
    textTransform: 'uppercase',
    zIndex: 2,
    transition: 'color 200ms ease',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '-4px',
      left: 0,
      width: '100%',
      opacity: 0,
      height: '2px',
      backgroundColor: '#b72429',
      transition: 'all 200ms linear',
      zIndex: 1
    },
    '&:hover': { color: '#b72429' },
    '&:hover:after': {
      opacity: 1
    }
  },
  navAccount: { marginLeft: 'auto', marginRight: theme.spacing(3) },
  navMobile: { marginRight: theme.spacing(1) },
  navIcon: {
    display: 'none',
    height: '30px',
    width: '30px',
    position: 'relative',
    zIndex: 2,
    cursor: 'pointer',
    '&:hover $navIconLine__left, &:hover $navIconLine__right': {
      width: '30px'
    }
  },
  navIconLine: {
    height: '2px',
    width: '30px',
    display: 'block',
    backgroundColor: theme.palette.common.white,
    marginBottom: '7px',
    transition: ' transform .2s ease, background-color .5s ease'
  },
  navIconLine__left: {
    width: '20px',
    transition: 'all 200ms linear'
  },
  navIconLine__right: {
    width: '20px',
    transition: 'all 200ms linear'
  },

  nav: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    paddingLeft: 0,
    marginBottom: 0,
    '&:before, &:after': {
      content: '""',
      position: 'fixed',
      width: '100vw',
      height: '100vh',
      background: 'rgba(255, 255, 255, 0.1)',
      zIndex: '-1',
      transition: 'transform cubic-bezier(0.77, 0, 0.175, 1) 0.8s',
      transform: 'translateX(0%) translateY(-100%)'
    },
    '&:before': {
      background: theme.palette.common.black,
      transitionDelay: '0s'
    },
    '&:after': {
      transitionDelay: '.1s'
    }
  },
  navActive: {
    visibility: 'visible',
    zIndex: 9,
    '&:before': {
      transitionDelay: '0s',
      transform: 'translateX(0%) translateY(0%)'
    },
    '&:after': {
      transitionDelay: '.1s',
      transform: 'translateX(0%) translateY(0%)'
    },
    '& $navContent': {
      visibility: 'visible'
    },
    '& $navContent $currentPageShadow': {
      transitionDelay: '.5s',
      opacity: 0.03,
      marginTop: '0'
    },
    '& $navContent $innerNavListItem': {
      transitionDelay: '.5s',
      opacity: 1,
      transform: 'translateX(0%)',
      transition: 'opacity .3s ease, transform .3s ease, color .3s ease'
    }
  },
  navContent: {
    position: 'fixed',
    visibility: 'hidden',
    top: '50%',
    transform: 'translate(0%, -50%)',
    width: '100%'
  },
  currentPageShadow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: 'sans-serif',
    fontSize: '10rem',
    fontWeight: 800,
    marginTop: '25px',
    color: '#fff',
    opacity: 0,
    transition: 'all 300ms linear'
  },
  innerNav: {
    position: 'relative',
    padding: 0,
    margin: 0,
    zIndex: 2
  },
  innerNavListItem: {
    opacity: 0,
    position: 'relative',
    display: 'block',
    textAlign: 'center',
    fontSize: '4rem',
    lineHeight: '1.05',
    letterSpacing: '3px',
    transform: 'translate(0%, 100%)',
    transition: 'opacity .2s ease, transform .3s ease'
  },
  innerNavLink: {
    position: 'relative',
    color: theme.palette.common.white,
    padding: '0 .5rem',
    margin: '0 1rem',
    fontSize: '2rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    zIndex: 2,
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      opacity: 0,
      height: 0,
      marginTop: '3px',
      backgroundColor: 'rgba(255,255,255,0.5)',
      transition: 'all 200ms linear',
      zIndex: 1
    },
    '&:hover:after': {
      opacity: 1,
      height: 15
    }
  },
  [theme.breakpoints.down('sm')]: {
    navIcon: { display: 'block' },
    navLinks: { display: 'none' }
  }
});
