import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { School, Visibility, Refresh } from '@material-ui/icons';
import setAuthHeaders from '../../../utils/setAuthHeaders';
import apiUrl from '../../../utils/apiUrl';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: '#0e0e14',
    minHeight: '100vh',
    color: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
  title: {
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  card: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.07)',
    overflow: 'auto',
  },
  table: {
    '& .MuiTableCell-root': {
      color: 'rgba(255,255,255,0.75)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      fontSize: '0.85rem',
    },
    '& .MuiTableCell-head': {
      color: '#fff',
      fontWeight: 700,
      whiteSpace: 'nowrap',
    },
  },
  dialogPaper: {
    backgroundColor: '#1a1a24',
    color: '#fff',
    minWidth: 480,
  },
  dialogTitle: {
    fontWeight: 700,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  detailRow: {
    marginBottom: theme.spacing(1.5),
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  detailValue: {
    color: '#fff',
    fontWeight: 600,
  },
  statusNew: {
    color: '#60a5fa',
    borderColor: 'rgba(96,165,250,0.4)',
    backgroundColor: 'rgba(96,165,250,0.1)',
  },
  statusContacted: {
    color: '#fbbf24',
    borderColor: 'rgba(251,191,36,0.4)',
    backgroundColor: 'rgba(251,191,36,0.1)',
  },
  statusConfirmed: {
    color: '#22c55e',
    borderColor: 'rgba(34,197,94,0.4)',
    backgroundColor: 'rgba(34,197,94,0.1)',
  },
  statusClosed: {
    color: 'rgba(255,255,255,0.5)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  empty: {
    textAlign: 'center',
    padding: theme.spacing(8),
    color: 'rgba(255,255,255,0.35)',
  },
}));

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'closed', label: 'Closed' },
];

const statusChipClass = (classes, status) => {
  switch (status) {
    case 'contacted':
      return classes.statusContacted;
    case 'confirmed':
      return classes.statusConfirmed;
    case 'closed':
      return classes.statusClosed;
    default:
      return classes.statusNew;
  }
};

const formatDate = value => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('en-IN');
};

export default function SchoolGroupInquiryList() {
  const classes = useStyles();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusDraft, setStatusDraft] = useState('new');
  const [saving, setSaving] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl('/admin/school-group-inquiries'), {
        headers: setAuthHeaders({ 'Content-Type': 'application/json' }),
      });
      const data = await response.json();
      if (response.ok) {
        setInquiries(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const openDetail = inquiry => {
    setSelected(inquiry);
    setStatusDraft(inquiry.status || 'new');
  };

  const handleSaveStatus = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const response = await fetch(apiUrl(`/admin/school-group-inquiries/${selected._id}`), {
        method: 'PATCH',
        headers: setAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status: statusDraft }),
      });
      const data = await response.json();
      if (response.ok) {
        setInquiries(prev =>
          prev.map(item => (item._id === data._id ? data : item))
        );
        setSelected(data);
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h4" className={classes.title}>
          <School style={{ color: '#b72429' }} />
          School Booking Enquiries
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchInquiries} style={{ color: '#fff' }}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </div>

      {loading ? (
        <CircularProgress style={{ color: '#b72429' }} />
      ) : inquiries.length === 0 ? (
        <div className={classes.empty}>
          <School style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
          <Typography>No school booking enquiries yet.</Typography>
        </div>
      ) : (
        <Paper className={classes.card} elevation={0}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Submitted</TableCell>
                <TableCell>School</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inquiries.map(row => (
                <TableRow key={row._id} hover>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell>{row.schoolName}</TableCell>
                  <TableCell>
                    {row.contactName}
                    <br />
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{row.phone}</span>
                  </TableCell>
                  <TableCell>{row.studentCount}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.status || 'new'}
                      variant="outlined"
                      className={statusChipClass(classes, row.status)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openDetail(row)} style={{ color: '#b72429' }}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        classes={{ paper: classes.dialogPaper }}
        maxWidth="sm"
        fullWidth>
        {selected && (
          <>
            <DialogTitle className={classes.dialogTitle}>Enquiry details</DialogTitle>
            <DialogContent>
              <div className={classes.detailRow}>
                <Typography className={classes.detailLabel}>School</Typography>
                <Typography className={classes.detailValue}>{selected.schoolName}</Typography>
              </div>
              <div className={classes.detailRow}>
                <Typography className={classes.detailLabel}>Coordinator</Typography>
                <Typography className={classes.detailValue}>{selected.contactName}</Typography>
              </div>
              <div className={classes.detailRow}>
                <Typography className={classes.detailLabel}>Email</Typography>
                <Typography className={classes.detailValue}>
                  <a href={`mailto:${selected.email}`} style={{ color: '#60a5fa' }}>
                    {selected.email}
                  </a>
                </Typography>
              </div>
              <div className={classes.detailRow}>
                <Typography className={classes.detailLabel}>Phone</Typography>
                <Typography className={classes.detailValue}>
                  <a href={`tel:${selected.phone}`} style={{ color: '#60a5fa' }}>
                    {selected.phone}
                  </a>
                </Typography>
              </div>
              <div className={classes.detailRow}>
                <Typography className={classes.detailLabel}>Students</Typography>
                <Typography className={classes.detailValue}>
                  {selected.studentCount}
                  {selected.gradeOrClass ? ` · ${selected.gradeOrClass}` : ''}
                </Typography>
              </div>
              {selected.preferredDate && (
                <div className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Preferred date</Typography>
                  <Typography className={classes.detailValue}>
                    {formatDate(selected.preferredDate)}
                  </Typography>
                </div>
              )}
              {selected.preferredMovie && (
                <div className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Preferred movie</Typography>
                  <Typography className={classes.detailValue}>{selected.preferredMovie}</Typography>
                </div>
              )}
              {selected.preferredCinema && (
                <div className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Preferred cinema</Typography>
                  <Typography className={classes.detailValue}>{selected.preferredCinema}</Typography>
                </div>
              )}
              {selected.offerCode && (
                <div className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Offer code</Typography>
                  <Typography className={classes.detailValue}>{selected.offerCode}</Typography>
                </div>
              )}
              {selected.message && (
                <div className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Notes</Typography>
                  <Typography className={classes.detailValue} style={{ fontWeight: 400 }}>
                    {selected.message}
                  </Typography>
                </div>
              )}
              <div className={classes.detailRow}>
                <Typography className={classes.detailLabel}>Submitted</Typography>
                <Typography className={classes.detailValue}>{formatDate(selected.createdAt)}</Typography>
              </div>
              <TextField
                select
                fullWidth
                label="Status"
                value={statusDraft}
                onChange={e => setStatusDraft(e.target.value)}
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                inputProps={{ style: { color: '#fff' } }}>
                {STATUS_OPTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <Button onClick={() => setSelected(null)} style={{ color: 'rgba(255,255,255,0.5)' }}>
                Close
              </Button>
              <Button
                onClick={handleSaveStatus}
                disabled={saving}
                variant="contained"
                style={{ backgroundColor: '#b72429', color: '#fff', fontWeight: 700 }}>
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Save status'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
