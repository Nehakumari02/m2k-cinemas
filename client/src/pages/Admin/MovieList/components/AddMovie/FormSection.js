import React from 'react';
import { Paper, Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    marginBottom: theme.spacing(2.5),
    padding: theme.spacing(2.5),
    borderRadius: 12,
    border: '1px solid #e8ecf1',
    boxShadow: 'none',
  },
  title: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#1e293b',
    marginBottom: theme.spacing(0.5),
  },
  subtitle: {
    color: '#64748b',
    display: 'block',
    marginBottom: theme.spacing(2),
    fontSize: '0.8rem',
  },
});

function FormSection({ classes, title, subtitle, children }) {
  return (
    <Paper className={classes.root} elevation={0}>
      {title && (
        <Typography variant="subtitle1" className={classes.title}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="caption" className={classes.subtitle}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Paper>
  );
}

export default withStyles(styles)(FormSection);
