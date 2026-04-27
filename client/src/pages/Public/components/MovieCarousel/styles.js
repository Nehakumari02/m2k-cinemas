export default theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 4),
    marginBottom: theme.spacing(2),
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  h2: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: theme.palette.common.white,
    textTransform: 'capitalize',
    letterSpacing: '0.02em',
  },
  titleAccent: {
    marginTop: '6px',
    width: '42px',
    height: '3px',
    background: '#b72429',
    borderRadius: '2px',
  },
  button: {
    color: '#b72429',
    borderColor: '#b72429',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    padding: '6px 18px',
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: 'rgba(183,36,41,0.08)',
      borderColor: '#b72429',
    }
  },
  carousel: {
    width: '85%',
    height: '100%',
    margin: 'auto'
  },
  arrow: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 60,
    width: '8%',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.common.white,
    zIndex: 1,
    '&.prevArrow': {
      left: 0,
      justifyContent: 'flex-start',
      background: 'linear-gradient(90deg, rgba(14,14,20,0.9) 0%, rgba(14,14,20,0) 100%)',
      opacity: ({ currentSlide }) => (currentSlide ? 1 : 0)
    },
    '&.nextArrow': {
      right: 0,
      justifyContent: 'flex-end',
      background: 'linear-gradient(90deg, rgba(14,14,20,0) 0%, rgba(14,14,20,0.9) 100%)',
      opacity: ({ currentSlide, slideCount }) =>
        currentSlide === slideCount ? 0 : 1
    }
  },

  slider: { '& .slick-slide': { padding: theme.spacing(1) } }
});
