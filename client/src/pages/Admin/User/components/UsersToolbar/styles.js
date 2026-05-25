export default theme => ({
  root: {},
  row: {
    minHeight: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  deleteButton: {
    color: theme.palette.danger.main,
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
});
