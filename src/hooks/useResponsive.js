import { useEffect, useState } from 'react';

// Simple responsive hook using matchMedia
export default function useResponsive() {
  const query = {
    xs: '(max-width: 480px)',
    sm: '(min-width: 481px) and (max-width: 768px)',
    md: '(min-width: 769px) and (max-width: 1024px)',
    lg: '(min-width: 1025px)'
  };

  const getState = () => ({
    isXS: window.matchMedia(query.xs).matches,
    isSM: window.matchMedia(query.sm).matches,
    isMD: window.matchMedia(query.md).matches,
    isLG: window.matchMedia(query.lg).matches,
  });

  const [state, setState] = useState(() => (typeof window !== 'undefined' ? getState() : { isXS:false,isSM:false,isMD:false,isLG:true }));

  useEffect(() => {
    const mqs = Object.values(query).map(q => window.matchMedia(q));
    const handler = () => setState(getState());
    mqs.forEach(mq => mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler));
    return () => mqs.forEach(mq => mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler));
  }, []);

  const breakpoint = state.isXS ? 'xs' : state.isSM ? 'sm' : state.isMD ? 'md' : 'lg';

  return { ...state, breakpoint };
}
