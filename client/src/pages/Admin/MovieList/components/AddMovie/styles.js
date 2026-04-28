export default theme => ({
  root: {},
  title: { marginLeft: theme.spacing(3) },
  field: {
    margin: theme.spacing(3),
    display: 'flex'
  },
  mediaField: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    flexWrap: 'wrap'
  },
  textField: {
    textTransform: 'capitalize',
    width: '100%',
    marginRight: theme.spacing(3)
  },
  peopleSection: {
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: theme.spacing(2),
    background: '#f8fafc'
  },
  sectionHeading: {
    marginBottom: theme.spacing(1),
    fontWeight: 700
  },
  sectionHint: {
    color: '#64748b',
    display: 'block',
    marginBottom: theme.spacing(1)
  },
  inputRow: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  crewRoleField: {
    minWidth: 160
  },
  listTitle: {
    fontWeight: 700,
    display: 'block',
    marginBottom: theme.spacing(0.5)
  },
  memberList: {
    maxHeight: 140,
    overflowY: 'auto',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    background: '#fff'
  },
  memberRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: `${theme.spacing(0.5)}px 0`,
    borderBottom: '1px dashed #e2e8f0',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  memberText: {
    color: '#1e293b'
  },
  emptyText: {
    color: '#64748b'
  },
  uploadTitle: {
    marginTop: theme.spacing(1)
  },
  fileHint: {
    display: 'block',
    marginTop: theme.spacing(0.5),
    color: '#334155'
  },
  fileList: {
    marginTop: theme.spacing(0.5)
  },
  upload: {
    width: '100%',
    marginTop: theme.spacing(2)
  },
  portletFooter: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  buttonFooter: {
    margin: theme.spacing(3)
  },
  infoMessage: {
    marginLeft: theme.spacing(3)
  }
});
