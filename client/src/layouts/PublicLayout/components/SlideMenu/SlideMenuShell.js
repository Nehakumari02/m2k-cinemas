import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { SlideMenuContext } from './SlideMenuContext';
import useAndroidSlideMenu, { FULL_MENU_WIDTH } from './useAndroidSlideMenu';
import QuickSlideMenu, { PEEK_MENU_WIDTH } from './QuickSlideMenu';
import SideDrawerMenu from '../Navbar/components/SideDrawer/SideDrawerMenu';

const EDGE_Z = 10050;

const useStyles = makeStyles({
  edgeHandle: {
    position: 'fixed',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 24,
    height: 140,
    border: 'none',
    borderRadius: '0 14px 14px 0',
    background: 'linear-gradient(180deg, #d32f2f 0%, #e53935 50%, #c62828 100%)',
    boxShadow: '3px 0 14px rgba(229, 57, 53, 0.45)',
    cursor: 'pointer',
    zIndex: EDGE_Z,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      width: 28,
      boxShadow: '4px 0 18px rgba(229, 57, 53, 0.55)',
    },
  },
  handleLabel: {
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    transform: 'rotate(180deg)',
    fontSize: '0.7rem',
    fontWeight: 800,
    letterSpacing: '0.18em',
    color: '#fff',
    userSelect: 'none',
  },
  panelWrap: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    zIndex: EDGE_Z - 1,
    willChange: 'transform',
  },
  panelDragging: {
    transition: 'none',
  },
  panelAnimating: {
    transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  scrim: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: EDGE_Z - 2,
  },
  surface: {
    position: 'relative',
    minHeight: '100vh',
  },
});

function EdgeMenuPortal({ children }) {
  if (typeof document === 'undefined') return null;
  return ReactDOM.createPortal(children, document.body);
}

export default function SlideMenuShell({
  children,
  isAuth,
  user,
  onLogout,
  cartCount,
  foodCartCount,
}) {
  const menu = useAndroidSlideMenu();
  const {
    peekOpen,
    fullOpen,
    toggle,
    close,
    openPeek,
    openFull,
    panelTranslateX,
    peekProgress,
    isDragging,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
  } = menu;

  const classes = useStyles();
  const surfaceRef = useRef(null);

  const panelVisible = peekProgress > 0 && !fullOpen;
  const showHandle = !peekOpen && !fullOpen && peekProgress === 0;
  const showScrim = panelVisible && (peekOpen || isDragging);

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return undefined;
    const blockScroll = e => {
      if (isDragging) e.preventDefault();
    };
    el.addEventListener('touchmove', blockScroll, { passive: false });
    return () => el.removeEventListener('touchmove', blockScroll);
  }, [isDragging]);

  const bindDrag = {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel: onTouchEnd,
    onMouseDown,
  };

  return (
    <SlideMenuContext.Provider
      value={{ open: peekOpen || fullOpen, setOpen: () => {}, toggle, close }}>
      <EdgeMenuPortal>
        {showHandle && (
          <button
            type="button"
            className={classes.edgeHandle}
            aria-label="Open quick menu"
            title="Menu — click or drag right"
            onClick={openPeek}
            {...bindDrag}>
            <span className={classes.handleLabel}>MENU</span>
          </button>
        )}

        {panelVisible && (
          <div
            className={[
              classes.panelWrap,
              isDragging ? classes.panelDragging : classes.panelAnimating,
            ].join(' ')}
            style={{ transform: `translate3d(${panelTranslateX}px, 0, 0)` }}>
            <QuickSlideMenu onNavigate={close} onOpenFullMenu={openFull} />
          </div>
        )}

        {showScrim && (
          <div
            className={classes.scrim}
            onClick={close}
            onTouchEnd={close}
            role="presentation"
          />
        )}
      </EdgeMenuPortal>

      <div ref={surfaceRef} className={classes.surface} {...bindDrag}>
        {children}
      </div>

      <Drawer
        anchor="left"
        open={fullOpen}
        onClose={close}
        ModalProps={{ keepMounted: true, style: { zIndex: EDGE_Z + 5 } }}
        PaperProps={{ style: { width: FULL_MENU_WIDTH } }}>
        <SideDrawerMenu
          onNavigate={close}
          isAuth={isAuth}
          user={user}
          onLogout={onLogout}
          cartCount={cartCount}
          foodCartCount={foodCartCount}
          showClose
        />
      </Drawer>
    </SlideMenuContext.Provider>
  );
}
