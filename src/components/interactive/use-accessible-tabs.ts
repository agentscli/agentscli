import { useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import './accessible-tabs.css';

/**
 * Shared WAI-ARIA tab behavior for interactive teaching widgets.
 *
 * A horizontal tab row is one Tab stop: Left/Right, Home, and End move the
 * active tab and focus it. Consumers spread `getTabProps(i)` onto each tab
 * and `panelProps` onto the associated panel.
 */
export function useAccessibleTabs(
  count: number,
  selectedIndex: number,
  onSelect: (index: number) => void
) {
  const id = useId().replace(/:/g, '');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = `accessible-tabs-${id}-panel`;

  const focusTab = (index: number) => {
    onSelect(index);
    requestAnimationFrame(() => tabRefs.current[index]?.focus());
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (event.key === 'ArrowRight') {
      next = (index + 1) % count;
    } else if (event.key === 'ArrowLeft') {
      next = (index - 1 + count) % count;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = count - 1;
    }

    if (next !== null) {
      event.preventDefault();
      focusTab(next);
    }
  };

  return {
    tabListProps: { role: 'tablist' as const, 'aria-orientation': 'horizontal' as const },
    getTabProps: (index: number) => ({
      id: `accessible-tabs-${id}-tab-${index}`,
      role: 'tab' as const,
      'aria-selected': selectedIndex === index,
      'aria-controls': panelId,
      tabIndex: selectedIndex === index ? 0 : -1,
      ref: (element: HTMLButtonElement | null) => {
        tabRefs.current[index] = element;
      },
      onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) =>
        onTabKeyDown(event, index),
    }),
    panelProps: {
      id: panelId,
      role: 'tabpanel' as const,
      'aria-labelledby': `accessible-tabs-${id}-tab-${selectedIndex}`,
      tabIndex: 0,
    },
  };
}
