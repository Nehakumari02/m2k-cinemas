import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, TextField, Grid, Button, Box } from '@material-ui/core';
import { Paper } from '../../../../../components';
import { getSeatDisplayLabel } from '../../../../../utils/seatLabels';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3)
  },
  paper: { padding: theme.spacing(4) },
  gridContainer: {
    marginTop: theme.spacing(4)
  },
  successInfo: { margin: theme.spacing(3) },
  ignoreButton: {
    marginLeft: theme.spacing(3)
  }
}));

export default function BookingInvitation(props) {
  const classes = useStyles(props);
  const {
    cinema,
    selectedSeats,
    sendInvitations,
    ignore,
    invitations,
    onSetInvitation,
    onDownloadPDF
  } = props;

  const notValidInvitations = !Object.keys(invitations).length;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h4" align="center">
          Guest Invitation
        </Typography>
        <Typography
          className={classes.successInfo}
          variant="body1"
          align="center">
          You have successfuly booked your seats. Please fill the emails below,
          to send invitations to your friends!
        </Typography>
        <Box width={1} textAlign="center">
          <Button
            color="primary"
            variant="outlined"
            onClick={() => onDownloadPDF()}>
            Download Pass
          </Button>
        </Box>
        <Grid className={classes.gridContainer} container spacing={3}>
          {selectedSeats.map((seat, index) => {
            const { row, seat: seatNum } = getSeatDisplayLabel(
              cinema,
              seat[0],
              seat[1]
            );
            const seatKey = `${row}-${seatNum}`;
            return (
            <Grid item xs={12} md={6} lg={4} key={'seat-' + index}>
              <TextField
                fullWidth
                label="email"
                name={seatKey}
                helperText={`Please select an Email for Row : ${row} - Seat Number : ${seatNum}`}
                margin="dense"
                required
                value={invitations[seatKey] || ''}
                variant="outlined"
                onChange={event => onSetInvitation(event)}
              />
            </Grid>
            );
          })}
          <Grid item xs={12} container>
            <Grid item>
              <Button
                disabled={notValidInvitations}
                color="primary"
                variant="outlined"
                onClick={() => sendInvitations()}>
                Send Invitations
              </Button>
            </Grid>
            <Grid item>
              <Button
                className={classes.ignoreButton}
                color="secondary"
                variant="outlined"
                onClick={() => ignore()}>
                Ignore
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
