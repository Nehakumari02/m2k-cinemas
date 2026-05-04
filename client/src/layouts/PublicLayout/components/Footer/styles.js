import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  root: {
    padding: theme.spacing(8, 0, 0),
    background: '#0f172a',
    color: '#ffffff',
    marginTop: theme.spacing(10)
  },
  copyright: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0.5)
  }
}));
