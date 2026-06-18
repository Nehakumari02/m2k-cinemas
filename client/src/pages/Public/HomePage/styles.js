export default theme => ({
  grid: { height: '100%' },
  heroCarousel: {
    '& .slick-dots': {
      bottom: 18,
      zIndex: 5
    },
    '& .slick-dots li button:before': {
      color: 'rgba(255,255,255,0.65)',
      opacity: 1
    },
    '& .slick-dots li.slick-active button:before': {
      color: '#b72429',
      opacity: 1
    }
  },
  customHero: {
    minHeight: '45vh',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  customHeroBackdrop: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transform: 'scale(1.01)',
  },
  customHeroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(2,6,23,.82) 12%, rgba(2,6,23,.45) 55%, rgba(2,6,23,.2) 100%)',
  },
  customHeroContent: {
    position: 'relative',
    zIndex: 2,
    width: 'min(720px, 92%)',
    marginLeft: '6%',
    color: '#fff',
  },
  customHeroTitle: {
    fontWeight: 900,
    fontSize: '3rem',
    lineHeight: 1.1,
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },
  customHeroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    maxWidth: 620,
    marginBottom: theme.spacing(2.5),
  },
  customHeroCta: {
    display: 'inline-block',
    textDecoration: 'none',
    color: '#fff',
    backgroundColor: '#b72429',
    borderRadius: 10,
    padding: '10px 18px',
    fontWeight: 700,
  },
  trailerVideoWrapper: {
    position: 'absolute',
    right: '8%',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 3,
    width: 400,
    height: 225,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)',
    border: '2px solid rgba(255,255,255,0.06)',
    background: '#000',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    '&:hover': {
      transform: 'translateY(-50%) scale(1.03)',
      boxShadow: '0 30px 70px rgba(0,0,0,0.8), 0 0 30px rgba(183,36,41,0.15)',
    },
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },

  /* ── Section Tabs ─────────────────────────── */
  tabsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 5%',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid rgba(15,23,42,0.08)',
    flexWrap: 'wrap',
    position: 'sticky',
    top: theme.topBar.height,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  tab: {
    background: 'transparent',
    border: '1px solid rgba(15,23,42,0.15)',
    color: '#475569',
    borderRadius: '24px',
    padding: '8px 20px',
    fontSize: '0.82rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#b72429',
      color: '#b72429',
    }
  },
  tabActive: {
    background: '#b72429',
    borderColor: '#b72429',
    color: '#ffffff',
    '&:hover': {
      background: '#8b1c20',
      color: '#ffffff',
    }
  },

  /* ── Carousel Sections ────────────────────── */
  sectionWrapper: {
    backgroundColor: '#f8fafc',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    scrollMarginTop: '130px',
  },
  carousel: {
    width: '92%',
    maxWidth: 1400,
    margin: '0 auto',
    paddingBottom: theme.spacing(5),
  },

  /* ── Cinemas ──────────────────────────────── */
  cinemasSection: {
    width: '90%',
    margin: '0 auto',
    padding: `${theme.spacing(6)}px 0`,
    scrollMarginTop: '130px',
  },
  cinemasTitleBlock: {
    marginBottom: theme.spacing(4),
  },
  sectionTitle: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '0.02em',
  },
  titleAccent: {
    marginTop: '8px',
    width: '42px',
    height: '3px',
    background: '#b72429',
    borderRadius: '2px',
  },

  /* ── Footer ───────────────────────────────── */
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid rgba(15,23,42,0.08)',
    color: '#0f172a',
    marginTop: theme.spacing(2),
  },
  footerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '48px 8%',
    gap: '40px',
    flexWrap: 'wrap',
  },
  footerBrand: {
    flex: '0 0 auto',
    maxWidth: '260px',
  },
  footerLogo: {
    fontSize: '1.8rem',
    fontWeight: 900,
    color: '#b72429',
    letterSpacing: '4px',
    lineHeight: 1,
    marginBottom: '12px',
  },
  footerTagline: {
    fontSize: '0.82rem',
    color: '#64748b',
    letterSpacing: '0.04em',
    lineHeight: 1.6,
  },
  footerLinks: {
    display: 'flex',
    gap: '60px',
    flexWrap: 'wrap',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: '120px',
  },
  footerColTitle: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#b72429',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  footerLink: {
    fontSize: '0.88rem',
    color: '#475569',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
    display: 'block',
    '&:hover': { color: '#b72429' }
  },
  footerBottom: {
    borderTop: '1px solid rgba(15,23,42,0.08)',
    padding: '18px 8%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  footerCopy: {
    fontSize: '0.78rem',
    color: '#64748b',
  },
  footerSocials: {
    display: 'flex',
    gap: '14px',
  },
  socialIcon: {
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': { transform: 'scale(1.25)' }
  },

  [theme.breakpoints.down('sm')]: {
    tabsBar: {
      top: theme.topBar.height,
      justifyContent: 'flex-start',
      overflowX: 'auto',
      flexWrap: 'nowrap',
      padding: '12px 16px',
      gap: '6px',
    },
    tab: { whiteSpace: 'nowrap' },
    carousel: { width: '100%' },
    cinemasSection: { width: '100%', padding: `${theme.spacing(4)}px ${theme.spacing(2)}px` },
    footerTop: { padding: '32px 5%', flexDirection: 'column' },
    footerLinks: { gap: '32px' },
    footerBottom: { padding: '14px 5%', flexDirection: 'column', textAlign: 'center' },
  }
});
