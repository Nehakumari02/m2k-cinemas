import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { Delete as DeleteIcon, AccountBalanceWallet as WalletIcon } from '@material-ui/icons';
import styles from './styles';

const UsersToolbar = props => {
  const { classes, className, toggleDialog, selectedUsers, deleteUser, addWalletFundsAdmin } = props;
  const rootClassName = classNames(classes.root, className);

  const [isFundsDialogOpen, setIsFundsDialogOpen] = useState(false);
  const [fundsAmount, setFundsAmount] = useState('');

  const handleAddFunds = () => {
    if (selectedUsers.length === 1 && fundsAmount) {
      addWalletFundsAdmin(selectedUsers[0], Number(fundsAmount)).then((res) => {
        if (res.status === 'success') {
          setIsFundsDialogOpen(false);
          setFundsAmount('');
        }
      });
    }
  };

  return (
    <div className={rootClassName}>
      <div className={classes.row}>
        <div>
          {selectedUsers.length > 0 && (
            <IconButton className={classes.deleteButton} onClick={deleteUser}>
              <DeleteIcon />
            </IconButton>
          )}
          {selectedUsers.length === 1 && (
            <Button
              onClick={() => setIsFundsDialogOpen(true)}
              color="primary"
              size="small"
              variant="outlined"
              style={{ marginRight: 8 }}>
              Add Funds
            </Button>
          )}
          <Button
            onClick={toggleDialog}
            color="primary"
            size="small"
            variant="outlined">
            {selectedUsers.length === 1 ? 'Edit' : 'Add'}
          </Button>
        </div>
      </div>

      <Dialog open={isFundsDialogOpen} onClose={() => setIsFundsDialogOpen(false)}>
        <DialogTitle>Add Funds to User Wallet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount (₹)"
            type="number"
            fullWidth
            value={fundsAmount}
            onChange={(e) => setFundsAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFundsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddFunds} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  selectedUsers: PropTypes.array
};

UsersToolbar.defaultProps = {
  selectedUsers: []
};
export default withStyles(styles)(UsersToolbar);
