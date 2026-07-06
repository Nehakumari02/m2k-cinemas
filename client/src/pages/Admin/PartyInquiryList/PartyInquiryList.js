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
  Grid,
} from '@material-ui/core';
import { Cake, Visibility, Refresh, GetApp as DownloadIcon } from '@material-ui/icons';
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
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  downloadBtn: {
    color: '#fff',
    borderColor: 'rgba(255,255,255,0.25)',
    textTransform: 'none',
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

export default function PartyInquiryList() {
  const classes = useStyles();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [newStatus, setNewStatus] = useState('new');
  const [saving, setSaving] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl('/admin/party-inquiries'), {
        headers: setAuthHeaders(),
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

  const handleDownloadCsv = () => {
    if (!inquiries.length) return;
    const headers = ['Date', 'Party Type', 'Party Name', 'Contact Name', 'Email', 'Phone', 'Guests', 'Age Group', 'Preferred Date', 'Movie', 'Cinema', 'Status'];
    const rows = inquiries.map(iq => [
      new Date(iq.createdAt).toLocaleDateString(),
      iq.partyType,
      iq.partyName,
      iq.contactName,
      iq.email,
      iq.phone,
      iq.guestCount,
      iq.ageGroup,
      iq.preferredDate ? new Date(iq.preferredDate).toLocaleDateString() : '',
      iq.preferredMovie,
      iq.preferredCinema,
      iq.status,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "party_inquiries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openDetail = inquiry => {
    setSelectedInquiry(inquiry);
    setNewStatus(inquiry.status || 'new');
  };

  const handleSaveStatus = async () => {
    if (!selectedInquiry) return;
    setSaving(true);
    try {
      const response = await fetch(apiUrl(`/admin/party-inquiries/${selectedInquiry._id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...setAuthHeaders(),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        setInquiries(prev =>
          prev.map(item => (item._id === data._id ? data : item))
        );
        setSelectedInquiry(data);
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
          <Cake style={{ fontSize: 32, color: '#b72429' }} />
          Party Booking Enquiries
        </Typography>
        <div className={classes.headerActions}>
          <Button variant="outlined" className={classes.downloadBtn} onClick={handleDownloadCsv} startIcon={<DownloadIcon />}>
            Export CSV
          </Button>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchInquiries} style={{ color: '#fff' }}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {loading ? (
        <CircularProgress style={{ color: '#b72429' }} />
      ) : inquiries.length === 0 ? (
        <div className={classes.empty}>
          <Cake style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
          <Typography>No party booking enquiries yet.</Typography>
        </div>
      ) : (
        <Paper className={classes.card} elevation={0}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Party Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inquiries.map(row => (
                <TableRow key={row._id} hover>
                  <TableCell>{new Date(row.createdAt).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>{row.partyType === 'birthday' ? 'Birthday' : 'Kitty'}</TableCell>
                  <TableCell>
                    <Typography variant="body2" style={{ fontWeight: 600 }}>
                      {row.partyName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.contactName}</Typography>
                    <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {row.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.guestCount}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.status || 'new'}
                      variant="outlined"
                      className={statusChipClass(classes, row.status)}
                    />
                  </TableCell>
                  <TableCell align="center">
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
        open={Boolean(selectedInquiry)}
        onClose={() => setSelectedInquiry(null)}
        classes={{ paper: classes.dialogPaper }}
        maxWidth="sm"
        fullWidth>
        {selectedInquiry && (
          <>
            <DialogTitle className={classes.dialogTitle}>Enquiry details</DialogTitle>
            <DialogContent>
              <Grid container>
                <Grid item xs={12} sm={6} className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Type</Typography>
                  <Typography className={classes.detailValue}>{selectedInquiry.partyType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Party Name</Typography>
                  <Typography className={classes.detailValue}>{selectedInquiry.partyName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Age Group</Typography>
                  <Typography className={classes.detailValue}>{selectedInquiry.ageGroup || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Contact Person</Typography>
                  <Typography className={classes.detailValue}>{selectedInquiry.contactName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Email Address</Typography>
                  <Typography className={classes.detailValue}>{selectedInquiry.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Phone Number</Typography>
                  <Typography className={classes.detailValue}>{selectedInquiry.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Number of Guests</Typography>
                  <Typography className={classes.detailValue}>{selectedInquiry.guestCount}</Typography>
                </Grid>
              </Grid>

              {selectedInquiry.preferredDate && (
                <div className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Preferred date</Typography>
                  <Typography className={classes.detailValue}>
                    {formatDate(selectedInquiry.preferredDate)}
                  </Typography>
                </div>
              )}
              {selectedInquiry.preferredMovie && (
                <div className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Preferred movie</Typography>
                  <Typography className={classes.detailValue}>{selectedInquiry.preferredMovie}</Typography>
                </div>
              )}
              {selectedInquiry.preferredCinema && (
                <div className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Preferred cinema</Typography>
                  <Typography className={classes.detailValue}>{selectedInquiry.preferredCinema}</Typography>
                </div>
              )}
              {selectedInquiry.offerCode && (
                <div className={classes.detailRow}>
                  <Typography className={classes.detailLabel}>Offer code</Typography>
                  <Typography className={classes.detailValue}>
                    <Chip label={selectedInquiry.offerCode} size="small" variant="outlined" />
                  </Typography>
                </div>
              )}
              {selectedInquiry.message && (
                <div className={classes.detailRow} style={{ marginTop: 16 }}>
                  <Typography className={classes.detailLabel}>Message</Typography>
                  <Typography className={classes.detailValue} style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedInquiry.message}
                  </Typography>
                </div>
              )}

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <Typography className={classes.detailLabel} style={{ marginBottom: 8 }}>Update status</Typography>
                <TextField
                  select
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  InputProps={{ style: { color: '#fff' } }}>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </TextField>
              </div>
            </DialogContent>
            <DialogActions style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <Button onClick={() => setSelectedInquiry(null)} style={{ color: 'rgba(255,255,255,0.5)' }}>
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
