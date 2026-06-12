import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

const useStyles = makeStyles(theme => ({
  root: { padding: theme.spacing(4) },
  paper: { padding: theme.spacing(3), marginBottom: theme.spacing(3) },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    color: '#b72429',
    fontWeight: 800,
  },
  form: {
    display: 'grid',
    gap: theme.spacing(2),
    maxWidth: 640,
  },
  sendButton: {
    backgroundColor: '#b72429',
    color: '#fff',
    fontWeight: 700,
    alignSelf: 'flex-start',
    '&:hover': {
      backgroundColor: '#991b1b',
    },
  },
  tableWrap: {
    overflowX: 'auto',
  },
}));

export default function PushNotifications() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('/');
  const [status, setStatus] = useState(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/admin/push-subscribers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => []);
      if (response.ok) setSubscribers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSend = async event => {
    event.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/admin/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body, url }),
      });
      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Unexpected server response.');
      }
      if (!response.ok) {
        throw new Error(data?.error?.message || 'Failed to send notification.');
      }
      setStatus({ type: 'success', message: data.message || 'Notification sent.' });
      setTitle('');
      setBody('');
      setUrl('/');
      fetchSubscribers();
    } catch (e) {
      setStatus({ type: 'error', message: e.message || 'Failed to send notification.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h4" className={classes.title}>
          <NotificationsActiveIcon />
          Push Notifications
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Send browser push alerts to users who enabled notifications on the M2K Cinemas website.
        </Typography>
        <Box mb={2}>
          <Chip
            label={`${subscribers.length} active subscriber${subscribers.length === 1 ? '' : 's'}`}
            style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 700 }}
          />
        </Box>
        <form className={classes.form} onSubmit={handleSend}>
          <TextField
            label="Notification title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            variant="outlined"
            required
            fullWidth
          />
          <TextField
            label="Message"
            value={body}
            onChange={e => setBody(e.target.value)}
            variant="outlined"
            required
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Open URL on click"
            value={url}
            onChange={e => setUrl(e.target.value)}
            variant="outlined"
            fullWidth
            helperText="Example: /offers (opens /#/offers) or /showtimings"
          />
          <Button
            type="submit"
            variant="contained"
            className={classes.sendButton}
            disabled={sending || !subscribers.length}>
            {sending ? 'Sending...' : 'Send Notification'}
          </Button>
          {status ? (
            <Typography
              variant="body2"
              style={{ color: status.type === 'success' ? '#166534' : '#b72429' }}>
              {status.message}
            </Typography>
          ) : null}
        </form>
      </Paper>

      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Active Subscribers
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <div className={classes.tableWrap}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Subscribed</TableCell>
                  <TableCell>Browser</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscribers.map(row => (
                  <TableRow key={row._id}>
                    <TableCell>
                      {row.user?.name || row.user?.email || row.user?.username || 'Guest visitor'}
                    </TableCell>
                    <TableCell>{new Date(row.updatedAt || row.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{row.userAgent ? row.userAgent.slice(0, 80) : '-'}</TableCell>
                  </TableRow>
                ))}
                {!subscribers.length && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No subscribers yet. Users can enable notifications from the website prompt.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Paper>
    </Container>
  );
}
