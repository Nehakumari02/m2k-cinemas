import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#0a0a0f',
    minHeight: '100vh',
    padding: '120px 0 80px',
    color: '#fff',
    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(183, 36, 41, 0.1) 0%, transparent 50%)',
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(8),
  },
  backButton: {
    color: '#fff',
    marginBottom: theme.spacing(4),
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  },
  title: {
    fontWeight: 900,
    fontSize: '3rem',
    textTransform: 'uppercase',
    letterSpacing: '-1px',
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(45deg, #fff 30%, #a1a1a1 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },
  highlight: {
    color: '#b72429',
    WebkitTextFillColor: '#b72429',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    maxWidth: '600px',
    margin: '0 auto',
    fontSize: '1.1rem',
  },
  galleryContainer: {
    marginTop: theme.spacing(6),
  },
  imageCard: {
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(183, 36, 41, 0.2)',
      '& $imageOverlay': {
        opacity: 1,
      }
    }
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    minHeight: '250px'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(183, 36, 41, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  searchIcon: {
    color: '#fff',
    fontSize: '3rem',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(8),
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '24px',
    border: '1px dashed rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: theme.spacing(6)
  },
  dialogPaper: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    overflow: 'hidden',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    zIndex: 10,
  },
  fullImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '90vh',
    objectFit: 'contain',
    display: 'block',
    borderRadius: '8px'
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
}));

export default useStyles;
