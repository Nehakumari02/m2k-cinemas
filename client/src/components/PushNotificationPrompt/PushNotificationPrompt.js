import React, { useEffect, useState } from 'react';
import {
  Snackbar,
  Button,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import {
  getPushPermission,
  isPushSubscribedLocally,
  isPushSupported,
  subscribeToPushNotifications,
} from '../../utils/pushNotifications';

const useStyles = makeStyles(theme => ({
  snackbar: {
    maxWidth: 420,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    backgroundColor: '#fff',
    color: '#0f172a',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
    padding: theme.spacing(1.5, 2),
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 1.5,
  },
  enableButton: {
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 700,
    '&:hover': {
      backgroundColor: '#991b1b',
    },
  },
}));

export default function PushNotificationPrompt() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isPushSupported()) return;
    const permission = getPushPermission();
    const dismissed = sessionStorage.getItem('m2k_push_prompt_dismissed') === 'true';
    const subscribed = isPushSubscribedLocally();

    if (!dismissed && !subscribed && permission === 'default') {
      const timer = setTimeout(() => setOpen(true), 2500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    setMessage('');
    try {
      await subscribeToPushNotifications();
      setOpen(false);
    } catch (e) {
      setMessage(e.message || 'Could not enable notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('m2k_push_prompt_dismissed', 'true');
    setOpen(false);
  };

  if (!isPushSupported()) return null;

  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className={classes.snackbar}>
        <div className={classes.content}>
          <NotificationsActiveIcon style={{ color: '#b72429' }} />
          <div className={classes.text}>
            Get alerts for new movies, offers, and showtimes from M2K Cinemas.
            {message ? <div style={{ color: '#b72429', marginTop: 6 }}>{message}</div> : null}
          </div>
          <Button
            size="small"
            variant="contained"
            className={classes.enableButton}
            disabled={loading}
            onClick={handleEnable}>
            {loading ? 'Enabling...' : 'Enable'}
          </Button>
          <IconButton size="small" onClick={handleDismiss} aria-label="Dismiss">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </Snackbar>
    </>
  );
}
