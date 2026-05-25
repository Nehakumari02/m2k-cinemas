import { useCallback, useEffect, useRef, useState } from 'react';
import { PEEK_MENU_WIDTH } from './QuickSlideMenu';

export const FULL_MENU_WIDTH = 280;
export const PEEK_OPEN_THRESHOLD = 40;

/** Middle-left handle zone (like Android Smart Sidebar) */
export function isMidLeftHandleTouch(clientX, clientY) {
  if (typeof window === 'undefined') return false;
  const h = window.innerHeight;
  const inVerticalBand = clientY >= h * 0.28 && clientY <= h * 0.72;
  const nearLeft = clientX <= 32;
  return inVerticalBand && nearLeft;
}

export function canStartPeekSwipe(clientX, clientY, peekOpen) {
  if (peekOpen) return true;
  return clientX <= 28 || isMidLeftHandleTouch(clientX, clientY);
}

/**
 * Overlay edge panel: swipe from left / middle handle reveals text rail.
 * Page stays fixed; panel slides over content.
 */
export default function useAndroidSlideMenu() {
  const [peekOpen, setPeekOpen] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);
  const [dragPeek, setDragPeek] = useState(null);
  const dragPeekRef = useRef(0);
  const touchRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    locked: null,
  });

  const peekProgress =
    dragPeek != null ? dragPeek : peekOpen ? PEEK_MENU_WIDTH : 0;

  const panelTranslateX = -PEEK_MENU_WIDTH + peekProgress;

  const beginDrag = useCallback(
    clientX => {
      touchRef.current = {
        active: true,
        startX: clientX,
        startY: 0,
        locked: null,
      };
      const start = peekOpen ? PEEK_MENU_WIDTH : 0;
      dragPeekRef.current = start;
      setDragPeek(start);
    },
    [peekOpen]
  );

  const moveDrag = useCallback(
    (clientX, clientY) => {
      const t = touchRef.current;
      if (!t.active || fullOpen) return;

      const dx = clientX - t.startX;
      const dy = clientY - t.startY;

      if (t.locked == null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.15) {
          t.active = false;
          setDragPeek(null);
          return;
        }
        t.locked = 'horizontal';
      }

      let next;
      if (peekOpen) {
        next = Math.min(PEEK_MENU_WIDTH, Math.max(0, PEEK_MENU_WIDTH + dx));
      } else {
        next = Math.min(PEEK_MENU_WIDTH, Math.max(0, dx));
      }
      dragPeekRef.current = next;
      setDragPeek(next);
    },
    [peekOpen, fullOpen]
  );

  const endDrag = useCallback(() => {
    const t = touchRef.current;
    if (!t.active || fullOpen) return;
    t.active = false;

    const x = dragPeek != null ? dragPeek : dragPeekRef.current;
    setDragPeek(null);
    dragPeekRef.current = 0;
    setPeekOpen(x >= PEEK_OPEN_THRESHOLD);
  }, [dragPeek, fullOpen]);

  useEffect(() => {
    if (peekOpen || fullOpen || dragPeek != null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [peekOpen, fullOpen, dragPeek]);

  const onTouchStart = useCallback(
    e => {
      if (fullOpen || e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      if (!canStartPeekSwipe(x, y, peekOpen)) return;
      touchRef.current.startY = y;
      beginDrag(x);
    },
    [peekOpen, fullOpen, beginDrag]
  );

  const onTouchMove = useCallback(
    e => {
      if (!touchRef.current.active || e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      if (touchRef.current.locked === 'horizontal') {
        e.preventDefault();
      }
      moveDrag(x, y);
    },
    [moveDrag]
  );

  const onTouchEnd = useCallback(() => {
    endDrag();
  }, [endDrag]);

  const onMouseDown = useCallback(
    e => {
      if (fullOpen || e.button !== 0) return;
      const x = e.clientX;
      const y = e.clientY;
      if (!canStartPeekSwipe(x, y, peekOpen)) return;
      e.preventDefault();
      touchRef.current.startY = y;
      beginDrag(x);

      const onMouseMove = ev => moveDrag(ev.clientX, ev.clientY);
      const onMouseUp = () => {
        endDrag();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [peekOpen, fullOpen, beginDrag, moveDrag, endDrag]
  );

  const closeAll = useCallback(() => {
    setFullOpen(false);
    setPeekOpen(false);
    setDragPeek(null);
  }, []);

  const openPeek = useCallback(() => {
    setPeekOpen(true);
    setDragPeek(null);
  }, []);

  const openFull = useCallback(() => {
    setFullOpen(true);
    setPeekOpen(false);
    setDragPeek(null);
  }, []);

  const toggle = useCallback(() => {
    if (fullOpen) {
      closeAll();
    } else {
      openFull();
    }
  }, [fullOpen, closeAll, openFull]);

  return {
    open: peekOpen || fullOpen,
    peekOpen,
    fullOpen,
    toggle,
    close: closeAll,
    openPeek,
    openFull,
    panelTranslateX,
    peekProgress,
    isDragging: dragPeek != null,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
  };
}
