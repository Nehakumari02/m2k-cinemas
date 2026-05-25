import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import SideDrawerMenu from './SideDrawerMenu';

/** Legacy overlay drawer (desktop fallback). Prefer SlideMenuShell on mobile. */
export default function SideDrawer({
  open,
  onClose,
  onOpen,
  isAuth,
  user,
  onLogout,
  cartCount,
  foodCartCount,
}) {
  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      disableSwipeToOpen={false}
      swipeAreaWidth={32}>
      <SideDrawerMenu
        onNavigate={onClose}
        isAuth={isAuth}
        user={user}
        onLogout={onLogout}
        cartCount={cartCount}
        foodCartCount={foodCartCount}
      />
    </SwipeableDrawer>
  );
}
