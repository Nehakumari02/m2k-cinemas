export default theme => ({
  card: {
    display: 'flex',
    flex: ' 0 0 auto',
    flexDirection: 'column',
    width: 400,
    height: 400,
    boxShadow: '0 10px 30px rgba(15,23,42,0.12)',
    margin: '60px 30px'
  },
  header: {
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '80%',
    padding: '5px 10px',
    width: '100%',
    color: theme.palette.common.white
  },
  body: {
    height: '20%',
    color: theme.palette.text.primary,
    padding: '15px',
    whiteSpace: 'normal'
  }
});
