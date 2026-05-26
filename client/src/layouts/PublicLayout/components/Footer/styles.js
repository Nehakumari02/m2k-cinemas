import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 0, 0),
    background: '#0f172a',
    color: '#ffffff',
    marginTop: theme.spacing(6),
  },
  addressBlock: {
    marginBottom: theme.spacing(1),
    lineHeight: 1.45,
    fontSize: '0.7rem',
    color: '#94a3b8',
  },
  addressLabel: {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: '#e2e8f0',
    marginBottom: 2,
    display: 'block',
  },
  copyright: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0.5)
  }
}));
