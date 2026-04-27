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

  /* ── Section Tabs ─────────────────────────── */
  tabsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 5%',
    backgroundColor: 'rgb(18,18,26)',
    borderBottom: '1px solid rgba(183,36,41,0.10)',
    flexWrap: 'wrap',
    position: 'sticky',
    top: '64px',
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  tab: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.65)',
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
    color: '#14141c',
    '&:hover': {
      background: '#8b1c20',
      color: '#14141c',
    }
  },

  /* ── Carousel Sections ────────────────────── */
  sectionWrapper: {
    backgroundColor: 'rgb(14,14,20)',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    scrollMarginTop: '130px',
  },
  carousel: {
    width: '90%',
    margin: '0 auto',
    paddingBottom: theme.spacing(4),
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
    color: theme.palette.common.white,
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
    backgroundColor: 'rgb(10,10,16)',
    borderTop: '1px solid rgba(183,36,41,0.15)',
    color: '#fff',
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
    color: 'rgba(255,255,255,0.45)',
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
    color: 'rgba(255,255,255,0.55)',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
    display: 'block',
    '&:hover': { color: '#b72429' }
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '18px 8%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  footerCopy: {
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.3)',
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
      top: '56px',
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
