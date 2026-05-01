import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  TextField, 
  Button, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@material-ui/core';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HistoryIcon from '@material-ui/icons/History';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import { getWalletData, addWalletMoney } from '../../../store/actions';

class WalletPage extends Component {
  state = {
    amount: ''
  };

  componentDidMount() {
    this.props.getWalletData();
  }

  onAddMoney = (e) => {
    e.preventDefault();
    const { amount } = this.state;
    if (amount > 0) {
      this.props.addWalletMoney(amount);
      this.setState({ amount: '' });
    }
  };

  render() {
    const { balance, transactions, loading } = this.props.wallet;
    const { amount } = this.state;

    return (
      <Container maxWidth="lg" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <Grid container spacing={4}>
          {/* Wallet Summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} style={{ 
              padding: '40px 32px', 
              borderRadius: 24, 
              background: 'linear-gradient(135deg, #b72429 0%, #7c1519 100%)',
              color: '#fff',
              boxShadow: '0 12px 24px rgba(183, 36, 41, 0.25)'
            }}>
              <Box display="flex" alignItems="center" mb={2}>
                <AccountBalanceWalletIcon style={{ fontSize: 32, marginRight: 12 }} />
                <Typography variant="h6" style={{ fontWeight: 600, opacity: 0.9 }}>
                  M2K Wallet Balance
                </Typography>
              </Box>
              <Typography variant="h3" style={{ fontWeight: 800, marginBottom: 8 }}>
                ₹{balance.toLocaleString('en-IN')}
              </Typography>
              <Typography variant="body2" style={{ opacity: 0.8 }}>
                Available for instant bookings
              </Typography>
            </Paper>

            <Paper elevation={0} style={{ 
              marginTop: 24, 
              padding: 32, 
              borderRadius: 24, 
              border: '1px solid #f1f5f9'
            }}>
              <Typography variant="h6" style={{ fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>
                Add Money
              </Typography>
              <form onSubmit={this.onAddMoney}>
                <TextField
                  fullWidth
                  label="Enter Amount"
                  variant="outlined"
                  type="number"
                  value={amount}
                  onChange={(e) => this.setState({ amount: e.target.value })}
                  placeholder="e.g. 500"
                  style={{ marginBottom: 20 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={!amount || amount <= 0}
                  startIcon={<AddCircleIcon />}
                  style={{ 
                    borderRadius: 12, 
                    padding: '12px', 
                    fontWeight: 700, 
                    background: '#b72429' 
                  }}
                >
                  Proceed to Pay
                </Button>
              </form>
              <Typography variant="caption" style={{ display: 'block', textAlign: 'center', marginTop: 16, color: '#94a3b8' }}>
                Secure payments powered by M2K Gateway
              </Typography>
            </Paper>
          </Grid>

          {/* Transaction History */}
          <Grid item xs={12} md={8}>
            <Box mb={3} display="flex" alignItems="center">
              <HistoryIcon style={{ color: '#b72429', marginRight: 12 }} />
              <Typography variant="h5" style={{ fontWeight: 800, color: '#0f172a' }}>
                Transaction History
              </Typography>
            </Box>

            <Paper elevation={0} style={{ 
              borderRadius: 24, 
              border: '1px solid #f1f5f9',
              overflow: 'hidden'
            }}>
              {loading ? (
                <Box py={10} textAlign="center">
                  <CircularProgress style={{ color: '#b72429' }} />
                </Box>
              ) : (
                <List disablePadding>
                  {transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                      <React.Fragment key={tx._id}>
                        <ListItem style={{ padding: '24px 32px' }}>
                          <ListItemIcon>
                            {tx.type === 'CREDIT' ? (
                              <Box style={{ 
                                background: 'rgba(34, 197, 94, 0.1)', 
                                padding: 10, 
                                borderRadius: 12 
                              }}>
                                <TrendingUpIcon style={{ color: '#22c55e' }} />
                              </Box>
                            ) : (
                              <Box style={{ 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                padding: 10, 
                                borderRadius: 12 
                              }}>
                                <TrendingDownIcon style={{ color: '#ef4444' }} />
                              </Box>
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" style={{ fontWeight: 700, color: '#1e293b' }}>
                                {tx.description}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" style={{ color: '#94a3b8' }}>
                                {new Date(tx.createdAt).toLocaleString('en-IN', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                            }
                          />
                          <Box textAlign="right">
                            <Typography variant="h6" style={{ 
                              fontWeight: 800, 
                              color: tx.type === 'CREDIT' ? '#22c55e' : '#ef4444' 
                            }}>
                              {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount}
                            </Typography>
                            <Typography variant="caption" style={{ 
                              color: '#64748b', 
                              textTransform: 'uppercase',
                              letterSpacing: '1px'
                            }}>
                              {tx.status}
                            </Typography>
                          </Box>
                        </ListItem>
                        {index < transactions.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Box py={10} textAlign="center">
                      <Typography color="textSecondary">No transactions yet.</Typography>
                    </Box>
                  )}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  wallet: state.walletState
});

const mapDispatchToProps = {
  getWalletData,
  addWalletMoney
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletPage);
