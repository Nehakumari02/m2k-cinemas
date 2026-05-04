export default (theme) => ({
  root: {
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    paddingBottom: theme.spacing(10)
  },
  hero: {
    background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=1500")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
    marginBottom: theme.spacing(6)
  },
  heroTitle: {
    fontWeight: 900,
    fontSize: '3.5rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: theme.spacing(2),
    '& span': {
      color: '#b72429'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.2rem'
    }
  },
  heroSubtitle: {
    fontWeight: 400,
    fontSize: '1.2rem',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
      padding: '0 20px'
    }
  },
  container: {
    marginTop: theme.spacing(-10),
    position: 'relative',
    zIndex: 2
  },
  filterSection: {
    backgroundColor: '#fff',
    padding: theme.spacing(3, 4),
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(4),
    flexWrap: 'wrap',
    gap: theme.spacing(2)
  },
  sectionTitle: {
    fontWeight: 800,
    color: '#111827',
    fontSize: '1.8rem'
  },
  categoryChips: {
    display: 'flex',
    gap: theme.spacing(1),
    overflowX: 'auto',
    paddingBottom: theme.spacing(1)
  },
  chip: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    fontWeight: 600,
    padding: '20px 10px',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#e5e7eb'
    }
  },
  activeChip: {
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 600,
    padding: '20px 10px',
    fontSize: '0.9rem',
    '&:hover': {
      backgroundColor: '#9a1e22'
    }
  },
  card: {
    height: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, boxShadow 0.3s ease',
    border: '1px solid #e5e7eb',
    boxShadow: 'none',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    }
  },
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden'
  },
  media: {
    height: 240,
    transition: 'transform 0.5s ease',
    '$card:hover &': {
      transform: 'scale(1.1)'
    }
  },
  typeIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    padding: '4px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  vegDot: {
    width: 12,
    height: 12,
    borderRadius: '2px',
    border: '2px solid #2e7d32',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: '#2e7d32',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  },
  nonVegDot: {
    width: 12,
    height: 12,
    borderRadius: '2px',
    border: '2px solid #c62828',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: '#c62828',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  },
  content: {
    padding: theme.spacing(3)
  },
  category: {
    color: '#b72429',
    fontWeight: 700,
    letterSpacing: '1px'
  },
  name: {
    fontWeight: 800,
    color: '#111827',
    marginBottom: theme.spacing(1)
  },
  description: {
    color: '#6b7280',
    marginBottom: theme.spacing(3),
    minHeight: '40px'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid #f3f4f6',
    paddingTop: theme.spacing(2)
  },
  price: {
    fontWeight: 800,
    color: '#111827'
  },
  addBtn: {
    backgroundColor: '#b72429',
    color: '#fff',
    borderRadius: '8px',
    padding: '8px 24px',
    fontWeight: 700,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#9a1e22'
    }
  },
  addedBtn: {
    backgroundColor: '#2e7d32',
    color: '#fff',
    borderRadius: '8px',
    padding: '8px 24px',
    fontWeight: 700,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#1b5e20'
    }
  },
  dealBadge: {
    position: 'absolute',
    top: 20,
    left: -35,
    backgroundColor: '#ff9800',
    color: '#fff',
    padding: '8px 40px',
    fontWeight: 800,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    transform: 'rotate(-45deg)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    zIndex: 10,
    letterSpacing: '1px',
    animation: '$pulse 2s infinite'
  },
  weekdayBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: 700,
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
    zIndex: 10,
    textTransform: 'uppercase'
  },
  originalPrice: {
    textDecoration: 'line-through',
    color: '#9ca3af',
    fontSize: '0.9rem',
    marginRight: theme.spacing(1)
  },
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 4px 10px rgba(255, 152, 0, 0.2)'
    },
    '50%': {
      boxShadow: '0 4px 20px rgba(255, 152, 0, 0.6)'
    },
    '100%': {
      boxShadow: '0 4px 10px rgba(255, 152, 0, 0.2)'
    }
  }
});
