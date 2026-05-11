export default theme => ({
  card: {
    display: 'flex',
    flex: ' 0 0 auto',
    flexDirection: 'column',
    width: '400px',
    boxShadow: `10px 5px 40px 20px ${theme.palette.background.dark}`,
    margin: '60px 30px'
  },
  header: {
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundSize: 'cover',
    height: '200px',
    padding: '5px 10px',
    width: '100%',
    color: theme.palette.common.white
  },
  body: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    padding: '15px',
    whiteSpace: 'normal'
  },
  formatBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'rgba(0, 0, 0, 0.75)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 800,
    padding: '3px 10px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    zIndex: 3,
    border: '1px solid rgba(255,255,255,0.2)',
  }
});
