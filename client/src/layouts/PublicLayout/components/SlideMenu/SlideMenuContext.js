import React from 'react';

export const SlideMenuContext = React.createContext({
  open: false,
  setOpen: () => {},
  toggle: () => {},
});

export function useSlideMenu() {
  return React.useContext(SlideMenuContext);
}
