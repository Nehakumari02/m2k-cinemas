export default theme => ({
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    padding: '0 16px',
    height: theme.topBar.height,
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    transform: 'translate3d(0,0,0)',
    backfaceVisibility: 'hidden',
    zIndex: 999,
    transition: 'background 300ms ease-in',
    background: '#ffffff',
    borderBottom: '1px solid rgba(183,36,41,0.15)'
  },
  navbarColor: {
    background: '#ffffff',
    borderBottom: '1px solid rgba(183,36,41,0.18)',
    transition: 'all 200ms ease-out'
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingTop: '.15rem',
    paddingBottom: '.15rem',
    marginRight: '12px',
    fontSize: '1.5rem',
    lineHeight: 'inherit',
    whiteSpace: 'nowrap',
    textDecoration: 'none'
  },
  logo: {
    height: '40px',
    width: 'auto',
    objectFit: 'contain',
    display: 'block'
  },
  navLinks: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center'
  },
  navLink: {
    position: 'relative',
    color: '#1f2937',
    padding: '0 .3rem',
    margin: '0 .3rem',
    fontSize: '0.73rem',
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
  socialLinks: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
    borderLeft: '1px solid rgba(183,36,41,0.15)',
    paddingLeft: theme.spacing(2),
  },
  socialIcon: {
    margin: '0 6px',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 200ms ease, opacity 200ms ease',
    '&:hover': {
      transform: 'scale(1.1)',
      opacity: 0.8
    }
  },
  searchContainer: {
    position: 'relative',
    marginLeft: '12px',
    marginRight: '12px',
    width: '180px',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '4px 8px',
    width: '100%',
  },
  searchIcon: {
    color: '#000000',
    marginRight: '6px',
    fontSize: '1.2rem',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    fontSize: '0.9rem',
    color: '#374151',
    '&::placeholder': {
      color: '#6b7280',
    }
  },
  searchDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    minWidth: '220px',
    marginTop: '4px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 1000,
    maxHeight: '350px',
    overflowY: 'auto',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    textDecoration: 'none',
    borderBottom: '1px solid #f3f4f6',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f9fafb',
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  dropdownImage: {
    width: '32px',
    height: '48px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '12px',
  },
  dropdownInfo: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  dropdownTitle: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#1f2937',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropdownSub: {
    fontSize: '0.7rem',
    color: '#6b7280',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropdownEmpty: {
    padding: '12px',
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#6b7280',
  },
  facebookIcon: { color: '#1877F2' },
  twitterIcon: { color: '#000000' },
  instagramIcon: { color: '#E1306C' },
  youtubeIcon: { color: '#FF0000' },
  navAccount: { 
    marginLeft: 'auto', 
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  navMobile: { marginRight: theme.spacing(1) },
  navIcon: {
    display: 'none',
    height: '24px',
    width: '30px',
    position: 'relative',
    zIndex: 1000,
    cursor: 'pointer',
    '&:hover $navIconLine__left, &:hover $navIconLine__right': {
      width: '30px'
    }
  },
  navIconLine: {
    height: '2px',
    width: '30px',
    display: 'block',
    backgroundColor: '#b72429',
    marginBottom: '6px',
    transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)'
  },
  navIconLine__left: {
    width: '20px',
  },
  navIconLine__right: {
    width: '24px',
    marginLeft: 'auto'
  },
  navIconActive: {
    '& $navIconLine': {
      backgroundColor: '#b72429'
    },
    '& $navIconLine:nth-child(1)': {
      transform: 'translateY(8px) rotate(45deg)',
      width: '30px'
    },
    '& $navIconLine:nth-child(2)': {
      opacity: 0,
      transform: 'translateX(-20px)'
    },
    '& $navIconLine:nth-child(3)': {
      transform: 'translateY(-8px) rotate(-45deg)',
      width: '30px'
    }
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
    visibility: 'hidden',
    '&:before, &:after': {
      content: '""',
      position: 'fixed',
      width: '100vw',
      height: '100vh',
      background: 'rgba(183, 36, 41, 0.05)',
      zIndex: '-1',
      transition: 'transform cubic-bezier(0.77, 0, 0.175, 1) 0.6s',
      transform: 'translateX(0%) translateY(-100%)'
    },
    '&:before': {
      background: '#ffffff',
      transitionDelay: '0s'
    },
    '&:after': {
      background: 'rgba(183, 36, 41, 0.95)',
      transitionDelay: '.1s'
    }
  },
  navActive: {
    visibility: 'visible',
    zIndex: 998,
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
      transitionDelay: '.4s',
      opacity: 0.05,
      marginTop: '0'
    },
    '& $navContent $innerNavListItem': {
      transitionDelay: '.4s',
      opacity: 1,
      transform: 'translateX(0%)',
      transition: 'opacity .4s ease, transform .4s ease'
    }
  },
  navContent: {
    position: 'fixed',
    visibility: 'hidden',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    overflowY: 'auto',
    padding: '80px 0 40px',
    [theme.breakpoints.down('sm')]: {
      top: 0,
      left: 0,
      transform: 'none',
      justifyContent: 'flex-start',
    }
  },
  currentPageShadow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '12rem',
    fontWeight: 900,
    marginTop: '50px',
    color: '#ffffff',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'all 400ms ease'
  },
  innerNav: {
    position: 'relative',
    padding: 0,
    margin: 0,
    zIndex: 2,
    listStyle: 'none'
  },
  innerNavListItem: {
    opacity: 0,
    position: 'relative',
    display: 'block',
    textAlign: 'center',
    margin: '1rem 0',
    transform: 'translateY(20px)',
    transition: 'opacity .3s ease, transform .3s ease',
    [theme.breakpoints.down('sm')]: {
      margin: '0.6rem 0',
    }
  },
  innerNavLink: {
    position: 'relative',
    color: '#ffffff',
    fontSize: '2.5rem',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#111827',
      letterSpacing: '6px'
    }
  },
  [theme.breakpoints.down('sm')]: {
    navbar: {
      padding: '0 16px'
    },
    logo: {
      fontSize: '1.4rem'
    },
    navIcon: { display: 'block' },
    navLinks: { display: 'none' },
    innerNavLink: {
      fontSize: '1.2rem',
      letterSpacing: '2px'
    }
  }
});
