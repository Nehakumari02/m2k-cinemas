import React from 'react';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  head: {
    backgroundColor: '#f8fafc',
  },
  headCell: {
    fontWeight: 700,
    color: '#64748b',
  },
}));

const MyRefundTable = ({ refunds }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table>
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell className={classes.headCell}>Type</TableCell>
            <TableCell className={classes.headCell}>Reason</TableCell>
            <TableCell className={classes.headCell}>Amount</TableCell>
            <TableCell className={classes.headCell}>Date</TableCell>
            <TableCell className={classes.headCell}>Status</TableCell>
            <TableCell className={classes.headCell}>Admin Note</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {refunds.map((refund) => (
            <TableRow key={refund._id}>
              <TableCell>{refund.type}</TableCell>
              <TableCell style={{ maxWidth: 200 }}>{refund.reason}</TableCell>
              <TableCell style={{ fontWeight: 700 }}>₹{refund.amount}</TableCell>
              <TableCell>{new Date(refund.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip 
                  label={refund.status} 
                  size="small"
                  style={{ 
                    backgroundColor: refund.status === 'Pending' ? '#ff9800' : refund.status === 'Approved' ? '#4caf50' : '#f44336',
                    color: '#fff'
                  }}
                />
              </TableCell>
              <TableCell>{refund.adminNote || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default MyRefundTable;
