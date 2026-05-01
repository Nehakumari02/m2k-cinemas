import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../../../store/actions';
import classnames from 'classnames';
import { withStyles, Typography, List, ListItem, Badge, IconButton } from '@material-ui/core';
import { ShoppingCart as ShoppingCartIcon } from '@material-ui/icons';

// Component styles
import styles from './styles';
import UserPopover from './components/UserPopover/UserPopover';

class Navbar extends Component {
  state = { showMenu: false, scrollPos: window.pageYOffset };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.setState({
      scrollPos: window.pageYOffset
    });
  };

  render() {
    const { showMenu, scrollPos } = this.state;
    const { classes, isAuth, user, logout, cartItems } = this.props;
    const cartCount = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0);
    return (
      <Fragment>
        <nav
          className={classnames({
            [classes.navbar]: true,
            [classes.navbarColor]: scrollPos > 30
          })}>
          <Link className={classes.logoLink} to="/">
            <img 
              src="https://m2kcinemas.com/Images/logo1.png" 
              alt="M2K Cinemas" 
              className={classes.logo} 
            />
          </Link>
          <div className={classes.navLinks}>
            <Link className={classes.navLink} to="/movies">
              Movies
            </Link>
            <Link className={classes.navLink} to="/cinemas">
              Cinemas
            </Link>
            <Link className={classes.navLink} to="/food-combos">
              Food & Combos
            </Link>
            <Link className={classes.navLink} to="/offers">
              Offers
            </Link>
            <Link className={classes.navLink} to="/events">
              Events
            </Link>
            <Link className={classes.navLink} to="/showtimings">
              Showtimings
            </Link>
            <Link className={classes.navLink} to="/about-us">
              About Us
            </Link>
            <Link className={classes.navLink} to="/contact-us">
              Contact Us
            </Link>
            <Link className={classes.navLink} to="/shop">
              Shop
            </Link>
            <Link className={classes.navLink} to="/cart">
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </Link>
          </div>

          <div className={classes.navAccount}>
            <UserPopover logout={logout}>
              <List component="nav">
                {user && (
                  <ListItem>
                    {user.role !== 'guest' ? (
                      <Link className={classes.navLink} to="/admin/dashboard">
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link className={classes.navLink} to="/mydashboard">
                        My Bookings
                      </Link>
                    )}
                  </ListItem>
                )}
                {user && user.role === 'guest' && (
                  <ListItem>
                    <Link className={classes.navLink} to="/mydashboard">
                      My Orders
                    </Link>
                  </ListItem>
                )}

                {isAuth ? (
                  <>
                    <ListItem>
                      <Link className={classes.navLink} to="/mywallet">
                        My Wallet
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link className={classes.navLink} onClick={logout} to="/">
                        Logout
                      </Link>
                    </ListItem>
                  </>
                ) : (
                  <ListItem>
                    <Link className={classes.navLink} to="/login">
                      Login
                    </Link>
                  </ListItem>
                )}
              </List>
            </UserPopover>
          </div>

          <div className={classes.navMobile}>
            <div
              className={classnames(classes.navIcon, {
                [classes.navIconActive]: showMenu
              })}
              onClick={() => this.setState({ showMenu: !this.state.showMenu })}>
              <div
                className={classnames(
                  classes.navIconLine,
                  classes.navIconLine__left
                )}
              />
              <div className={classes.navIconLine} />
              <div
                className={classnames(
                  classes.navIconLine,
                  classes.navIconLine__right
                )}
              />
            </div>
          </div>
        </nav>
        <div
          className={classnames({
            [classes.navActive]: showMenu,
            [classes.nav]: true
          })}>
          <div className={classes.navContent}>
            <div className={classes.currentPageShadow}>M2K</div>
            <ul
              className={classes.innerNav}
              onClick={() => this.setState({ showMenu: !this.state.showMenu })}>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/movies">
                  Movies
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/cinemas">
                  Cinemas
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/food-combos">
                  Food & Combos
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/offers">
                  Offers
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/events">
                  Events
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/showtimings">
                  Showtimings
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/about-us">
                  About Us
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/contact-us">
                  Contact Us
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/shop">
                  Shop
                </Link>
              </li>
              <li className={classes.innerNavListItem}>
                <Link className={classes.innerNavLink} to="/cart">
                  Cart ({cartCount})
                </Link>
              </li>
              {user && (
                <li className={classes.innerNavListItem}>
                  {user.role !== 'guest' ? (
                    <Link className={classes.innerNavLink} to="/admin/dashboard">
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link className={classes.innerNavLink} to="/mydashboard">
                      My Bookings
                    </Link>
                  )}
                </li>
              )}
              {user && (
                <li className={classes.innerNavListItem}>
                  <Link className={classes.innerNavLink} to="/mywallet">
                    My Wallet
                  </Link>
                </li>
              )}
              {isAuth ? (
                <li className={classes.innerNavListItem}>
                  <Link
                    className={classes.innerNavLink}
                    onClick={logout}
                    to="/">
                    Logout
                  </Link>
                </li>
              ) : (
                <li className={classes.innerNavListItem}>
                  <Link className={classes.innerNavLink} to="/login">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuth: state.authState.isAuthenticated,
  user: state.authState.user,
  cartItems: state.cartState.cartItems
});

const mapDispatchToProps = {
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Navbar));
