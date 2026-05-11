export default theme => ({
  container: {
    height: '100%',
    paddingTop: theme.spacing(10),
    background:
      'linear-gradient(180deg, #f2f6fb 0%, #f8fafc 35%, #f8fafc 100%)',
    minHeight: '100vh',
  },
  pageHeader: {
    marginBottom: theme.spacing(2),
    borderRadius: 14,
    border: '1px solid #dbe5f2',
    background: 'linear-gradient(90deg, #0f2847 0%, #1c406f 100%)',
    color: '#fff',
    padding: theme.spacing(2, 2.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  pageEyebrow: {
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: '0.12em',
    lineHeight: 1.2,
    fontWeight: 700,
  },
  pageTitle: {
    fontWeight: 800,
    fontSize: '1.5rem',
    lineHeight: 1.2,
    marginBottom: theme.spacing(0.5),
  },
  pageSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 500,
  },
  stepPills: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  stepPill: {
    borderRadius: 999,
    padding: theme.spacing(0.7, 1.5),
    border: '1px solid rgba(255,255,255,0.35)',
    color: 'rgba(255,255,255,0.92)',
    fontWeight: 700,
    fontSize: '0.78rem',
    background: 'rgba(255,255,255,0.08)',
  },
  stepPillActive: {
    background: '#f0b429',
    borderColor: '#f0b429',
    color: '#16263d',
  },
  mediaSection: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    padding: theme.spacing(3),
  },
  peopleBlock: {
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    fontWeight: 800,
    color: '#111827',
    marginBottom: theme.spacing(1.5),
  },
  peopleScroller: {
    display: 'flex',
    gap: theme.spacing(2),
    overflowX: 'auto',
    paddingBottom: theme.spacing(1),
    '&::-webkit-scrollbar': {
      height: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#cbd5e1',
      borderRadius: 10,
    },
  },
  personCard: {
    minWidth: 128,
    textAlign: 'center',
    flexShrink: 0,
  },
  personImage: {
    width: 104,
    height: 104,
    borderRadius: '50%',
    objectFit: 'cover',
    display: 'block',
    margin: '0 auto 8px auto',
    border: '2px solid #e2e8f0',
  },
  personName: {
    fontWeight: 700,
    color: '#0f172a',
    lineHeight: 1.3,
  },
  personRole: {
    color: '#64748b',
  },
  backdropBlock: {
    marginTop: theme.spacing(1),
  },
  backdropCard: {
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid rgba(15,23,42,0.1)',
    boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
  },
  backdropImage: {
    width: '100%',
    height: 210,
    objectFit: 'cover',
    display: 'block',
  },
  proceedBar: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  proceedButton: {
    background: 'linear-gradient(90deg, #b72429, #8b1c20)',
    color: '#fff',
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderRadius: 8,
    padding: theme.spacing(1.2, 3),
    '&:hover': {
      background: 'linear-gradient(90deg, #8b1c20, #6d1518)',
    },
  },
  [theme.breakpoints.down('md')]: {
    root: { height: '100%' },
    container: {
      paddingTop: theme.spacing(8),
    },
    pageHeader: {
      padding: theme.spacing(1.6, 1.8),
      borderRadius: 10,
    },
    pageTitle: {
      fontSize: '1.2rem',
    },
    mediaSection: {
      padding: theme.spacing(2),
    },
    personCard: {
      minWidth: 110,
    },
    personImage: {
      width: 92,
      height: 92,
    },
    backdropImage: {
      height: 180,
    },
    proceedButton: {
      width: '100%',
    },
  }
});
