export default theme => ({
  root: {
    maxWidth: 920,
    margin: '0 auto',
    paddingBottom: theme.spacing(2),
  },
  pageTitle: {
    fontWeight: 800,
    fontSize: '1.35rem',
    color: '#0f172a',
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1.5),
    borderBottom: '2px solid #e8ecf1',
  },
  grid: {
    marginBottom: theme.spacing(1),
  },
  field: {
    marginBottom: theme.spacing(1.5),
  },
  castCrewGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  castCrewCard: {
    padding: theme.spacing(2),
    borderRadius: 10,
    border: '1px solid #e8ecf1',
    background: '#fafbfc',
    height: '100%',
  },
  castCrewTitle: {
    fontWeight: 700,
    fontSize: '0.88rem',
    color: '#334155',
    marginBottom: theme.spacing(1.5),
  },
  galleryContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(1),
  },
  backdropThumb: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    '& img': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    color: 'white',
    padding: '2px 6px',
    minWidth: 0,
    fontSize: '0.6rem',
    borderRadius: 4,
    zIndex: 1,
    '&:hover': {
      backgroundColor: 'rgb(220, 38, 38)',
    },
  },
  uploadBtn: {
    textTransform: 'none',
    fontWeight: 600,
    marginTop: theme.spacing(1),
  },
  hiddenInput: {
    display: 'none',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(2),
    borderTop: '2px solid #e8ecf1',
  },
  upload: {
    width: '100%',
  },
  switchRow: {
    marginTop: theme.spacing(0.5),
  },
});
