import { useState, useMemo, useEffect, useRef } from 'react';
import { buildSlotRange } from '../utils/calendar';

interface DragState {
  isDragging: boolean;
  startKey: string | null;
  currentKey: string | null;
  action: 'select' | 'deselect' | null;
  meta: any;
}

interface TouchState {
  timer: ReturnType<typeof setTimeout> | null;
  startPos: { x: number; y: number } | null;
  pendingTap: { key: string; action: 'select' | 'deselect'; meta: any } | null;
}

export const usePointerRangeSelection = ({
  dataAttribute,
  onApplyRange,
}: {
  dataAttribute: string;
  onApplyRange: (action: 'select' | 'deselect', range: Set<string>, meta?: any) => void;
}) => {
  const [dragSelection, setDragSelection] = useState<DragState>({
    isDragging: false,
    startKey: null,
    currentKey: null,
    action: null,
    meta: null,
  });
  
  const applyRangeRef = useRef(onApplyRange);
  const dragStateRef = useRef({ isDragging: false });
  const touchStateRef = useRef<TouchState>({ timer: null, startPos: null, pendingTap: null });

  useEffect(() => {
    applyRangeRef.current = onApplyRange;
  }, [onApplyRange]);

  const currentRange = useMemo(
    () => buildSlotRange(dragSelection.startKey, dragSelection.currentKey),
    [dragSelection.startKey, dragSelection.currentKey]
  );

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      const ts = touchStateRef.current;
      if (ts.timer) {
        clearTimeout(ts.timer);
        ts.timer = null;
        
        if (ts.pendingTap) {
          const { key, action, meta } = ts.pendingTap;
          applyRangeRef.current(action, new Set([key]), meta);
        }
      }
      ts.pendingTap = null;
      ts.startPos = null;
      
      setDragSelection(prev => {
        if (prev.isDragging && prev.startKey && prev.currentKey && prev.action) {
          applyRangeRef.current(prev.action, buildSlotRange(prev.startKey, prev.currentKey), prev.meta);
        }
        dragStateRef.current.isDragging = false;
        document.body.style.touchAction = '';
        document.body.classList.remove('select-none');
        return { isDragging: false, startKey: null, currentKey: null, action: null, meta: null };
      });
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const ts = touchStateRef.current;
      
      if (!dragStateRef.current.isDragging) {
        if (ts.startPos && ts.timer) {
          const dx = touch.clientX - ts.startPos.x;
          const dy = touch.clientY - ts.startPos.y;
          if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
            clearTimeout(ts.timer);
            ts.timer = null;
            ts.pendingTap = null;
          }
        }
        return;
      }
      
      if (e.cancelable) e.preventDefault();

      setDragSelection(prev => {
        if (!prev.isDragging) return prev;
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!el) return prev;
        const targetEl = el.closest(`[${dataAttribute}]`);
        if (!targetEl) return prev;
        const key = targetEl.getAttribute(dataAttribute);
        if (!key || key === prev.currentKey) return prev;
        return { ...prev, currentKey: key };
      });
    };

    window.addEventListener('mouseup', handleGlobalPointerUp);
    window.addEventListener('touchend', handleGlobalPointerUp);
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mouseup', handleGlobalPointerUp);
      window.removeEventListener('touchend', handleGlobalPointerUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
    };
  }, [dataAttribute]);

  const startSelection = (key: string, action: 'select' | 'deselect', meta: any = null) => {
    dragStateRef.current.isDragging = true;
    setDragSelection({ isDragging: true, startKey: key, currentKey: key, action, meta });
  };
  
  const startTouchSelection = (key: string, action: 'select' | 'deselect', e: React.TouchEvent, meta: any = null) => {
    const touch = e.touches[0];
    const ts = touchStateRef.current;
    ts.startPos = { x: touch.clientX, y: touch.clientY };
    ts.pendingTap = { key, action, meta };
    
    if (ts.timer) clearTimeout(ts.timer);
    
    ts.timer = setTimeout(() => {
      ts.timer = null;
      ts.pendingTap = null;
      dragStateRef.current.isDragging = true;
      
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
      document.body.style.touchAction = 'none';
      document.body.classList.add('select-none');
      
      setDragSelection({ isDragging: true, startKey: key, currentKey: key, action, meta });
    }, 300);
  };

  const updateSelection = (key: string) => {
    setDragSelection(prev => {
      if (!prev.isDragging || prev.currentKey === key) return prev;
      return { ...prev, currentKey: key };
    });
  };

  return { dragSelection, currentRange, startSelection, startTouchSelection, updateSelection };
};
