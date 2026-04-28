export default theme => ({
  container: {
    height: '100%',
    paddingTop: theme.spacing(10),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
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
  [theme.breakpoints.down('md')]: {
    root: { height: '100%' },
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
  }
});
