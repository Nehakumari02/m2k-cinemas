import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
} from '@material-ui/core';
import HistoryIcon from '@material-ui/icons/History';

const useStyles = makeStyles(theme => ({
  root: { padding: theme.spacing(4) },
  paper: { padding: theme.spacing(3) },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    color: '#b72429',
    fontWeight: 800,
  },
  filters: {
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
  },
  tableWrap: { overflowX: 'auto' },
  mono: { fontFamily: 'monospace', fontSize: '0.78rem' },
}));

export default function ActivityLogs() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [entityType, setEntityType] = useState('');
  const [action, setAction] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const params = new URLSearchParams();
      if (entityType.trim()) params.set('entityType', entityType.trim());
      if (action.trim()) params.set('action', action.trim());
      const response = await fetch(`/admin/activity-logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => []);
      if (response.ok) setRows(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Container maxWidth="xl" className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h4" className={classes.title}>
          <HistoryIcon />
          Activity Logs
        </Typography>
        <div className={classes.filters}>
          <TextField
            size="small"
            variant="outlined"
            label="Entity type"
            value={entityType}
            onChange={e => setEntityType(e.target.value)}
          />
          <TextField
            size="small"
            variant="outlined"
            label="Action"
            value={action}
            onChange={e => setAction(e.target.value)}
          />
          <Button variant="contained" color="secondary" onClick={fetchLogs}>
            Filter
          </Button>
        </div>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <div className={classes.tableWrap}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>When</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Endpoint</TableCell>
                  <TableCell>Updated fields</TableCell>
                  <TableCell>Entity</TableCell>
                  <TableCell>Actor</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>User Agent</TableCell>
                  <TableCell>Meta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row._id}>
                    <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{row.action}</TableCell>
                    <TableCell className={classes.mono}>{row.meta?.endpoint || '-'}</TableCell>
                    <TableCell>{Array.isArray(row.meta?.changedFields) && row.meta.changedFields.length ? row.meta.changedFields.join(', ') : '-'}</TableCell>
                    <TableCell>{row.entityType}{row.entityId ? `:${row.entityId}` : ''}</TableCell>
                    <TableCell>{row.actorName || '-'}</TableCell>
                    <TableCell>{row.actorRole || '-'}</TableCell>
                    <TableCell className={classes.mono}>{row.ip || '-'}</TableCell>
                    <TableCell className={classes.mono}>{row.userAgent || '-'}</TableCell>
                    <TableCell className={classes.mono}>{JSON.stringify(row.meta || {})}</TableCell>
                  </TableRow>
                ))}
                {!rows.length && (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No activity logs found.
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

