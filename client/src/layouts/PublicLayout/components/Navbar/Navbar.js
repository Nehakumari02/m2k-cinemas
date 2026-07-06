import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout, getMovies } from '../../../../store/actions';
import classnames from 'classnames';
import { withStyles, List, ListItem, Badge } from '@material-ui/core';
import {
  ShoppingCart as ShoppingCartIcon,
  Fastfood as FoodCartIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Search as SearchIcon
} from '@material-ui/icons';
import { XIcon } from '../../../../components';
import { normalizeImage } from '../../../../utils/imageUrl';

import styles from './styles';
import UserPopover from './components/UserPopover/UserPopover';

class Navbar extends Component {
  state = { scrollPos: window.pageYOffset, searchQuery: '', isSearchFocused: false };
  searchRef = React.createRef();

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    document.addEventListener('mousedown', this.handleClickOutside);
    this.props.getMovies();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.searchRef.current && !this.searchRef.current.contains(event.target)) {
      this.setState({ isSearchFocused: false });
    }
  };

  handleScroll = () => {
    this.setState({
      scrollPos: window.pageYOffset
    });
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    if (this.state.searchQuery.trim()) {
      this.props.history.push(`/movies?search=${encodeURIComponent(this.state.searchQuery.trim())}`);
      this.setState({ searchQuery: '', isSearchFocused: false });
    }
  };

  render() {
    const { scrollPos, searchQuery, isSearchFocused } = this.state;
    const { classes, isAuth, user, logout, cartItems, foodCartItems, movies } = this.props;
    const cartCount = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0);
    const foodCartCount = (foodCartItems || []).reduce((acc, item) => acc + item.quantity, 0);
    
    // Filter movies for dropdown
    const searchStr = searchQuery.toLowerCase().trim();
    let searchResults = [];
    if (searchStr && isSearchFocused && movies) {
      searchResults = movies.filter(m => {
        if (m.title && m.title.toLowerCase().includes(searchStr)) return true;
        if (m.cast && m.cast.toLowerCase().includes(searchStr)) return true;
        if (m.director && m.director.toLowerCase().includes(searchStr)) return true;
        return false;
      }).slice(0, 5); // Limit to 5 results
    }
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
            
            <div className={classes.searchContainer} ref={this.searchRef}>
              <form className={classes.searchForm} onSubmit={this.handleSearchSubmit}>
                <SearchIcon className={classes.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className={classes.searchInput}
                  value={searchQuery}
                  onChange={e => this.setState({ searchQuery: e.target.value })}
                  onFocus={() => this.setState({ isSearchFocused: true })}
                />
              </form>
              
              {isSearchFocused && searchQuery.trim() && (
                <div className={classes.searchDropdown}>
                  {searchResults.length > 0 ? (
                    searchResults.map(movie => (
                      <Link 
                        key={movie._id} 
                        to={`/movie/booking/${movie._id}`} 
                        className={classes.dropdownItem}
                        onClick={() => this.setState({ searchQuery: '', isSearchFocused: false })}
                      >
                        <img src={normalizeImage(movie.image)} alt={movie.title} className={classes.dropdownImage} />
                        <div className={classes.dropdownInfo}>
                          <div className={classes.dropdownTitle}>{movie.title}</div>
                          <div className={classes.dropdownSub}>{movie.director || 'N/A'}</div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className={classes.dropdownEmpty}>No movies found</div>
                  )}
                </div>
              )}
            </div>

            <Link className={classes.navLink} to="/food-cart" title="Food cart">
              <Badge badgeContent={foodCartCount} color="secondary">
                <FoodCartIcon />
              </Badge>
            </Link>
            <Link className={classes.navLink} to="/cart" title="Shop cart">
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </Link>
            <div className={classes.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={classes.socialIcon}>
                <FacebookIcon fontSize="small" className={classes.facebookIcon} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={classes.socialIcon}>
                <XIcon fontSize="small" className={classes.twitterIcon} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={classes.socialIcon}>
                <InstagramIcon fontSize="small" className={classes.instagramIcon} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={classes.socialIcon}>
                <YouTubeIcon fontSize="small" className={classes.youtubeIcon} />
              </a>
            </div>
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
                {user && user.isSessionGuest && (
                  <ListItem>
                    <Link className={classes.navLink} to="/register" style={{ color: '#facc15' }}>
                      Create full account
                    </Link>
                  </ListItem>
                )}
                {user && user.role === 'guest' && (
                  <>
                    <ListItem>
                      <Link className={classes.navLink} to="/myorders">
                        My Orders
                      </Link>
                    </ListItem>
                    <ListItem>
                      <Link className={classes.navLink} to="/wishlist">
                        My Wishlist
                      </Link>
                    </ListItem>
                  </>
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

        </nav>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuth: state.authState.isAuthenticated,
  user: state.authState.user,
  cartItems: state.cartState.cartItems,
  foodCartItems: state.foodCartState.cartItems,
  movies: state.movieState.movies
});

const mapDispatchToProps = {
  logout,
  getMovies
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Navbar)));
