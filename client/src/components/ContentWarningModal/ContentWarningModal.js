import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  makeStyles
} from '@material-ui/core';
import { Warning as WarningIcon, ArrowForward as ArrowForwardIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  dialog: {
    borderRadius: 24,
  },
  title: {
    fontWeight: 800,
    color: '#0f172a',
    textAlign: 'center',
    paddingTop: theme.spacing(3),
    paddingBottom: 0,
  },
  iconWrapper: {
    background: '#fef2f2',
    borderRadius: '50%',
    padding: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    width: 'fit-content',
    marginBottom: theme.spacing(1),
  },
  warningIcon: {
    fontSize: 32,
    color: '#ef4444',
  },
  movieTitle: {
    color: '#64748b',
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: theme.spacing(1),
    fontSize: '0.9rem',
  },
  divider: {
    margin: '0 auto 16px',
    width: '40px',
    height: '3px',
    background: '#ef4444',
    borderRadius: '2px',
  },
  contentText: {
    fontSize: '1rem',
    color: '#334155',
    lineHeight: 1.5,
    textAlign: 'center',
    padding: theme.spacing(0, 2, 1),
  },
  actions: {
    padding: theme.spacing(2, 4, 3),
    justifyContent: 'center',
    gap: theme.spacing(1.5),
  },
  buttonContinue: {
    borderRadius: 12,
    padding: '10px 32px',
    fontWeight: 800,
    background: '#b72429',
    color: 'white',
    '&:hover': {
      background: '#8b1c20',
    }
  },
  buttonCancel: {
    borderRadius: 12,
    padding: '10px 24px',
    fontWeight: 700,
    color: '#64748b',
    borderColor: '#e2e8f0',
  }
}));

const ContentWarningModal = ({ open, handleClose, handleContinue, movie }) => {
  const classes = useStyles();

  if (!movie) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: classes.dialog,
        style: { borderRadius: 24 }
      }}
    >
      <DialogTitle className={classes.title}>
        <Box className={classes.iconWrapper}>
          <WarningIcon className={classes.warningIcon} />
        </Box>
        Content Advisory
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" className={classes.movieTitle}>
          {movie.title}
        </Typography>
        <Divider className={classes.divider} />
        <DialogContentText className={classes.contentText}>
          {movie.contentWarning || "This movie contains content that may not be suitable for all audiences. Please proceed with caution."}
        </DialogContentText>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button
          onClick={handleClose}
          variant="outlined"
          className={classes.buttonCancel}
        >
          Go Back
        </Button>
        <Button
          onClick={handleContinue}
          variant="contained"
          className={classes.buttonContinue}
          endIcon={<ArrowForwardIcon />}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContentWarningModal;
