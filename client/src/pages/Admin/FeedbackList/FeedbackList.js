import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import {
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Select,
  MenuItem,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FeedbackIcon from '@material-ui/icons/Feedback';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(4),
  },
  title: {
    fontWeight: 800,
  },
  chip: {
    fontWeight: 700,
    borderRadius: 8,
  },
  table: {
    minWidth: 700,
  },
  tableHead: {
    backgroundColor: '#f8fafc',
    '& th': {
      fontWeight: 700,
      color: '#374151',
      fontSize: '0.85rem',
    },
  },
  messageCell: {
    maxWidth: 400,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontSize: '0.9rem',
    color: '#374151',
  },
  statusNew: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    fontWeight: 700,
  },
  statusRead: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
    fontWeight: 700,
  },
  statusResolved: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    fontWeight: 700,
  },
  dateCell: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    whiteSpace: 'nowrap',
  },
});

function FeedbackAdminPage({ classes, token }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/admin/feedbacks', { headers: authHeaders });
      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`/admin/feedbacks/${id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      setFeedbacks((prev) => prev.map((f) => (f._id === id ? { ...f, status } : f)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await fetch(`/admin/feedbacks/${id}`, { method: 'DELETE', headers: authHeaders });
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const statusChipClass = (status) => {
    if (status === 'read') return classes.statusRead;
    if (status === 'resolved') return classes.statusResolved;
    return classes.statusNew;
  };

  const newCount = feedbacks.filter((f) => f.status === 'new').length;

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <FeedbackIcon style={{ color: '#b72429', fontSize: 32 }} />
        <Typography variant="h5" className={classes.title}>
          Customer Feedback
        </Typography>
        {newCount > 0 && (
          <Chip
            label={`${newCount} new`}
            size="small"
            className={classes.chip}
            style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
          />
        )}
      </div>

      {loading ? (
        <CircularProgress style={{ color: '#b72429' }} />
      ) : feedbacks.length === 0 ? (
        <Typography style={{ color: '#9ca3af' }}>No feedback submissions yet.</Typography>
      ) : (
        <Paper elevation={2} style={{ overflowX: 'auto' }}>
          <Table className={classes.table}>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.map((fb) => (
                <TableRow key={fb._id} hover>
                  <TableCell style={{ fontWeight: 600 }}>{fb.name || '—'}</TableCell>
                  <TableCell style={{ fontSize: '0.85rem', color: '#6b7280' }}>{fb.email || '—'}</TableCell>
                  <TableCell className={classes.messageCell}>{fb.message}</TableCell>
                  <TableCell>
                    <Select
                      value={fb.status}
                      onChange={(e) => handleStatusChange(fb._id, e.target.value)}
                      disableUnderline
                      renderValue={(val) => (
                        <Chip
                          label={val.charAt(0).toUpperCase() + val.slice(1)}
                          size="small"
                          className={`${classes.chip} ${statusChipClass(val)}`}
                        />
                      )}
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="read">Read</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell className={classes.dateCell}>
                    {new Date(fb.createdAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(fb._id)}>
                        <DeleteIcon style={{ color: '#ef4444' }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  token: state.authState.token,
});

export default connect(mapStateToProps)(withStyles(styles)(FeedbackAdminPage));
