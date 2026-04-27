export default theme => ({
  container: {
    height: '100%',
    paddingTop: theme.spacing(10),
    backgroundColor: 'rgb(14,14,20)',
    minHeight: '100vh',
  },
  [theme.breakpoints.down('md')]: {
    root: { height: '100%' }
  }
});
