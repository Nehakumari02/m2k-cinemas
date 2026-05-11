import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Box,
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { CheckCircle } from '@material-ui/icons';
import { getMemberships, purchaseMembership } from '../../../store/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(8, 0),
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(6),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    borderRadius: 16,
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
    },
  },
  silver: {
    borderTop: '8px solid #C0C0C0',
  },
  gold: {
    borderTop: '8px solid #FFD700',
    transform: 'scale(1.05)',
    zIndex: 1,
    '&:hover': {
      transform: 'scale(1.08) translateY(-10px)',
    },
  },
  platinum: {
    borderTop: '8px solid #E5E4E2',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
  },
  price: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: theme.spacing(2, 0),
    color: '#b72429',
  },
  benefitIcon: {
    color: '#b72429',
    minWidth: 36,
  },
  button: {
    marginTop: 'auto',
    borderRadius: 25,
    padding: '10px 30px',
    fontWeight: 'bold',
  },
  currentPlan: {
    backgroundColor: '#b72429',
    color: '#white',
    pointerEvents: 'none',
  }
}));

const MembershipPage = ({ 
  getMemberships, 
  purchaseMembership, 
  memberships, 
  user,
  isAuthenticated 
}) => {
  const classes = useStyles();

  useEffect(() => {
    getMemberships();
  }, [getMemberships]);

  const handlePurchase = (planId) => {
    if (!isAuthenticated) {
      // Show login or alert
      return;
    }
    purchaseMembership(planId);
  };

  const getTierClass = (name) => {
    switch (name) {
      case 'Silver': return classes.silver;
      case 'Gold': return classes.gold;
      case 'Platinum': return classes.platinum;
      default: return '';
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <div className={classes.header}>
          <Typography variant="h3" gutterBottom style={{ fontWeight: 800, color: '#333' }}>
            Exclusive Membership Plans
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Unlock premium benefits and save more on every visit to M2K Cinemas
          </Typography>
        </div>

        <Grid container spacing={4} alignItems="center">
          {memberships.map((plan) => (
            <Grid item xs={12} md={4} key={plan._id}>
              <Card className={`${classes.card} ${getTierClass(plan.name)}`}>
                <CardContent>
                  <Typography variant="h4" align="center" style={{ fontWeight: 700 }}>
                    {plan.name}
                  </Typography>
                  <Box display="flex" justifyContent="center" alignItems="baseline">
                    <Typography className={classes.price}>₹{plan.price}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">/year</Typography>
                  </Box>
                  <List>
                    {plan.benefits.map((benefit, idx) => (
                      <ListItem key={idx} disableGutters>
                        <ListItemIcon className={classes.benefitIcon}>
                          <CheckCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions style={{ padding: 24 }}>
                  <Button
                    fullWidth
                    variant={(user?.membership?._id || user?.membership) === plan._id ? "contained" : "outlined"}
                    color="primary"
                    className={`${classes.button} ${(user?.membership?._id || user?.membership) === plan._id ? classes.currentPlan : ''}`}
                    onClick={() => handlePurchase(plan._id)}
                  >
                    {(user?.membership?._id || user?.membership) === plan._id ? 'Current Plan' : 'Get Started'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({
  memberships: state.membership.memberships,
  user: state.authState.user,
  isAuthenticated: state.authState.isAuthenticated,
});

export default connect(mapStateToProps, { getMemberships, purchaseMembership })(MembershipPage);
