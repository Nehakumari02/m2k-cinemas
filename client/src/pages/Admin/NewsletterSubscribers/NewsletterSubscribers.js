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
  Chip,
  Button,
} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

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
  tableWrap: {
    overflowX: 'auto',
  },
}));

export default function NewsletterSubscribers() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('/admin/newsletter-subscribers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => []);
      if (response.ok) setRows(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const toggleStatus = async row => {
    const nextStatus = row.status === 'subscribed' ? 'unsubscribed' : 'subscribed';
    const token = localStorage.getItem('jwtToken');
    await fetch(`/admin/newsletter-subscribers/${row._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });
    fetchRows();
  };

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h4" className={classes.title}>
          <MailOutlineIcon />
          Newsletter Subscribers
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <div className={classes.tableWrap}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Subscribed At</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row._id}>
                    <TableCell>{row.email || '-'}</TableCell>
                    <TableCell>{row.phone || '-'}</TableCell>
                    <TableCell>{row.source || 'footer_newsletter'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.status}
                        style={{
                          backgroundColor: row.status === 'subscribed' ? '#dcfce7' : '#fee2e2',
                          color: row.status === 'subscribed' ? '#166534' : '#991b1b',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(row.createdAt || row.consentAt || Date.now()).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" onClick={() => toggleStatus(row)}>
                        {row.status === 'subscribed' ? 'Unsubscribe' : 'Resubscribe'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!rows.length && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No newsletter subscribers yet.
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

