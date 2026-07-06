import React, { Component } from 'react';
import { connect } from 'react-redux';
import { register } from '../../../store/actions';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import styles from './styles';
import FileUpload from '../../../components/FileUpload/FileUpload';

class Register extends Component {
  state = {
    values: {
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      image: null,
      policy: false
    },
    isTermsOpen: false
  };

  componentDidUpdate(prevProps) {
    const { isAuthenticated, history } = this.props;
    if (prevProps.isAuthenticated !== isAuthenticated || isAuthenticated)
      history.push('/');
  }

  handleBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState.values[field] = value;
    this.setState(newState);
  };

  handleRegister = () => {
    const newUser = this.state.values;
    this.props.register(newUser);
  };

  render() {
    const { classes } = this.props;
    const { values, isTermsOpen } = this.state;

    const isValid = values.policy;

    const handleTermsOpen = (e) => {
      e.preventDefault();
      this.setState({ isTermsOpen: true });
    };

    const handleTermsClose = () => {
      this.setState({ isTermsOpen: false });
    };

    return (
      <div className={classes.root}>
        <Grid className={classes.grid} container>
          <Grid className={classes.bgWrapper} item lg={5}>
            <div className={classes.bg} />
          </Grid>
          <Grid className={classes.content} item lg={7} xs={12}>
            <div className={classes.content}>
              <div className={classes.contentHeader}>
                <IconButton
                  className={classes.backButton}
                  onClick={this.handleBack}>
                  <ArrowBackIcon />
                </IconButton>
              </div>
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography className={classes.title} variant="h2">
                    Create new account
                  </Typography>
                  <Typography className={classes.subtitle} variant="body1">
                    Use your email to create new account... it's free.
                  </Typography>
                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label="Full name"
                      name="name"
                      value={values.name}
                      onChange={event =>
                        this.handleFieldChange('name', event.target.value)
                      }
                      variant="outlined"
                      required
                    />
                    <TextField
                      className={classes.textField}
                      label="User name"
                      name="username"
                      value={values.username}
                      onChange={event =>
                        this.handleFieldChange('username', event.target.value)
                      }
                      variant="outlined"
                    />
                    <TextField
                      className={classes.textField}
                      label="Email address"
                      name="email"
                      value={values.email}
                      onChange={event =>
                        this.handleFieldChange('email', event.target.value)
                      }
                      variant="outlined"
                      required
                    />
                    <TextField
                      className={classes.textField}
                      label="Mobile Phone"
                      name="phone"
                      value={values.phone}
                      variant="outlined"
                      onChange={event =>
                        this.handleFieldChange('phone', event.target.value)
                      }
                      required
                    />
                    <TextField
                      className={classes.textField}
                      label="Password"
                      type="password"
                      value={values.password}
                      variant="outlined"
                      onChange={event =>
                        this.handleFieldChange('password', event.target.value)
                      }
                    />
                    <FileUpload
                      className={classes.upload}
                      file={values.image}
                      onUpload={event => {
                        const file = event.target.files[0];
                        this.handleFieldChange('image', file);
                      }}
                    />
                    <div className={classes.policy}>
                      <Checkbox
                        checked={values.policy}
                        className={classes.policyCheckbox}
                        color="primary"
                        name="policy"
                        onChange={() =>
                          this.handleFieldChange('policy', !values.policy)
                        }
                      />
                      <Typography
                        className={classes.policyText}
                        variant="body1">
                        I have read the &nbsp;
                        <a href="#" className={classes.policyUrl} onClick={handleTermsOpen} style={{ color: '#1877F2', textDecoration: 'none' }}>
                          Terms and Conditions
                        </a>
                        .
                      </Typography>
                    </div>
                  </div>

                  <Dialog
                    open={isTermsOpen}
                    onClose={handleTermsClose}
                    aria-labelledby="terms-dialog-title"
                    maxWidth="md"
                    fullWidth
                  >
                    <DialogTitle id="terms-dialog-title">Terms and Conditions</DialogTitle>
                    <DialogContent dividers>
                      <DialogContentText tabIndex={-1} style={{ whiteSpace: 'pre-wrap' }}>
                        {`Welcome to M2K Cinemas!

1. Acceptance of Terms
By creating an account, you agree to abide by these Terms and Conditions. If you do not agree to these terms, please do not register.

2. User Accounts
- You must provide accurate and complete information during registration.
- You are responsible for maintaining the confidentiality of your account credentials.
- You must immediately notify us of any unauthorized use of your account.

3. Booking and Payments
- All tickets purchased are non-transferable and subject to our cancellation policy.
- We reserve the right to change ticket prices and availability at any time.

4. Conduct
- You agree not to use our services for any unlawful purposes.
- Any disruption, abuse, or fraudulent activity may result in account termination.

5. Privacy
- Your privacy is important to us. Please refer to our Privacy Policy for details on how we collect and use your data.

6. Changes to Terms
We may update these terms periodically. Continued use of our services constitutes acceptance of the revised terms.`}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleTermsClose} color="primary" variant="contained">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <Button
                    className={classes.registerButton}
                    color="primary"
                    disabled={!isValid}
                    onClick={this.handleRegister}
                    size="large"
                    variant="contained">
                    Register now
                  </Button>

                  <Typography className={classes.login} variant="body1">
                    Have an account?{' '}
                    <Link className={classes.loginUrl} to="/login">
                      Login
                    </Link>
                  </Typography>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Register.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.authState.isAuthenticated
});

export default withStyles(styles)(
  connect(mapStateToProps, { register })(Register)
);
