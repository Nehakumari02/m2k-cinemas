import React from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Divider,
  Badge,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import MovieIcon from '@material-ui/icons/Movie';
import TheatersIcon from '@material-ui/icons/Theaters';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import EventIcon from '@material-ui/icons/Event';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CardMembershipIcon from '@material-ui/icons/CardMembership';
import SchoolIcon from '@material-ui/icons/School';
import InfoIcon from '@material-ui/icons/Info';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import StorefrontIcon from '@material-ui/icons/Storefront';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import WalletIcon from '@material-ui/icons/AccountBalanceWallet';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

function NavRow({ to, icon, primary, secondary, onNavigate, badge }) {
  return (
    <ListItem button component={Link} to={to} onClick={onNavigate}>
      <ListItemIcon style={{ minWidth: 40, color: '#b72429' }}>{icon}</ListItemIcon>
      <ListItemText
        primary={primary}
        secondary={secondary}
        primaryTypographyProps={{ style: { fontWeight: 600, color: '#0f172a' } }}
        secondaryTypographyProps={{ style: { fontSize: '0.75rem' } }}
      />
      {badge != null && badge > 0 ? (
        <Badge badgeContent={badge} color="secondary" />
      ) : null}
    </ListItem>
  );
}

function SectionLabel({ children }) {
  return (
    <Typography
      variant="overline"
      style={{
        padding: '16px 16px 8px',
        fontWeight: 800,
        color: '#64748b',
        letterSpacing: '0.12em',
      }}>
      {children}
    </Typography>
  );
}

export default function SideDrawerMenu({
  onNavigate,
  isAuth,
  user,
  onLogout,
  cartCount,
  foodCartCount,
  showClose = true,
}) {
  const close = () => onNavigate();

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      style={{ background: '#fff' }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1.5}
        style={{
          borderBottom: '1px solid rgba(183,36,41,0.15)',
          background: 'linear-gradient(135deg, #fff 0%, #fef2f2 100%)',
        }}>
        <Box>
          <Typography variant="subtitle1" style={{ fontWeight: 800, color: '#b72429' }}>
            M2K Cinemas
          </Typography>
          <Typography variant="caption" color="textSecondary">
            All menu options
          </Typography>
        </Box>
        {showClose && (
          <IconButton onClick={close} aria-label="Close menu" size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box flex={1} overflow="auto">
        <List disablePadding>
          <SectionLabel>Browse</SectionLabel>
          <NavRow to="/" icon={<HomeIcon />} primary="Home" onNavigate={close} />
          <NavRow to="/movies" icon={<MovieIcon />} primary="Movies" onNavigate={close} />
          <NavRow
            to="/showtimings"
            icon={<TheatersIcon />}
            primary="Showtimings"
            onNavigate={close}
          />
          <NavRow to="/cinemas" icon={<TheatersIcon />} primary="Cinemas" onNavigate={close} />
          <NavRow to="/events" icon={<EventIcon />} primary="Events" onNavigate={close} />

          <Divider style={{ margin: '8px 16px' }} />
          <SectionLabel>Food &amp; Shop</SectionLabel>
          <NavRow
            to="/food-combos"
            icon={<FastfoodIcon />}
            primary="Food & Combos"
            onNavigate={close}
          />
          <NavRow
            to="/food-cart"
            icon={<FastfoodIcon />}
            primary="Food cart"
            onNavigate={close}
            badge={foodCartCount}
          />
          <NavRow to="/shop" icon={<StorefrontIcon />} primary="Shop" onNavigate={close} />
          <NavRow
            to="/cart"
            icon={<ShoppingCartIcon />}
            primary="Shop cart"
            onNavigate={close}
            badge={cartCount}
          />

          <Divider style={{ margin: '8px 16px' }} />
          <SectionLabel>Offers</SectionLabel>
          <NavRow to="/offers" icon={<LocalOfferIcon />} primary="Offers" onNavigate={close} />
          <NavRow
            to="/membership"
            icon={<CardMembershipIcon />}
            primary="Membership"
            onNavigate={close}
          />
          <NavRow
            to="/school-group-booking"
            icon={<SchoolIcon />}
            primary="School group booking"
            onNavigate={close}
          />

          <Divider style={{ margin: '8px 16px' }} />
          <SectionLabel>More</SectionLabel>
          <NavRow to="/about-us" icon={<InfoIcon />} primary="About us" onNavigate={close} />
          <NavRow
            to="/contact-us"
            icon={<ContactMailIcon />}
            primary="Contact us"
            onNavigate={close}
          />

          <Divider style={{ margin: '8px 16px' }} />
          <SectionLabel>Account</SectionLabel>
          {isAuth ? (
            <>
              {user && (
                <NavRow
                  to={user.role !== 'guest' ? '/admin/dashboard' : '/mydashboard'}
                  icon={<AccountCircleIcon />}
                  primary={user.role !== 'guest' ? 'Admin dashboard' : 'My bookings'}
                  onNavigate={close}
                />
              )}
              {user?.role === 'guest' && (
                <>
                  <NavRow
                    to="/myorders"
                    icon={<ShoppingCartIcon />}
                    primary="My orders"
                    onNavigate={close}
                  />
                  <NavRow
                    to="/wishlist"
                    icon={<FavoriteIcon />}
                    primary="Wishlist"
                    onNavigate={close}
                  />
                </>
              )}
              {user?.isSessionGuest && (
                <NavRow
                  to="/register"
                  icon={<PersonAddIcon />}
                  primary="Create full account"
                  secondary="Required for ticket booking"
                  onNavigate={close}
                />
              )}
              <NavRow
                to="/mywallet"
                icon={<WalletIcon />}
                primary="My wallet"
                onNavigate={close}
              />
              <ListItem
                button
                onClick={() => {
                  onLogout();
                  close();
                }}>
                <ListItemIcon style={{ minWidth: 40, color: '#b72429' }}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ style: { fontWeight: 600 } }}
                />
              </ListItem>
            </>
          ) : (
            <>
              <NavRow to="/login" icon={<VpnKeyIcon />} primary="Login" onNavigate={close} />
              <NavRow
                to="/register"
                icon={<PersonAddIcon />}
                primary="Register"
                onNavigate={close}
              />
            </>
          )}
        </List>
      </Box>
    </Box>
  );
}
