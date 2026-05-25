export default theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    justifyContent: 'space-between'
  },
  searchInput: {
    marginRight: theme.spacing(1),
    flex: 1,
    maxWidth: 360,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  downloadBtn: {
    textTransform: 'none',
    whiteSpace: 'nowrap',
  },
});
