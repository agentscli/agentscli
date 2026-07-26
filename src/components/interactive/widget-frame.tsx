import { useEffect, useState } from 'react';
import './widget-frame.css';

/**
 * Class list for an interactive-widget root. Flips on `ac-widget--live`
 * after hydration - with `client:visible` that means first scroll into
 * view - which runs the one-shot border trace (see widget-frame.css).
 */
export function useWidgetFrame(rootClass: string): string {
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  return `${rootClass} not-content ac-widget${live ? ' ac-widget--live' : ''}`;
}
