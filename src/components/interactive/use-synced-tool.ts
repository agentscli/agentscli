import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'starlight-synced-tabs__tool';
export const TOOL_PREFERENCE_EVENT = 'agentscli:tool-preference';

interface ToolOption {
  id?: string;
  slug?: string;
  label: string;
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

function findToolIndex(options: readonly ToolOption[], value: string | null) {
  if (!value) return -1;
  const target = normalize(value);
  return options.findIndex((option) =>
    [option.id, option.slug, option.label]
      .filter((candidate): candidate is string => Boolean(candidate))
      .some((candidate) => normalize(candidate) === target)
  );
}

/**
 * Keeps a widget's tool selector aligned with Starlight's synced ToolTabs.
 *
 * Starlight persists a tab label in localStorage, but same-document storage
 * writes do not emit a `storage` event. The custom event covers widget changes;
 * a MutationObserver covers changes made in Starlight's own tab element.
 */
export function useSyncedToolIndex(
  options: readonly ToolOption[],
  explicitInitial?: string
) {
  const fallbackIndex = useMemo(() => {
    const explicitIndex = findToolIndex(options, explicitInitial ?? null);
    return explicitIndex >= 0 ? explicitIndex : 0;
  }, [explicitInitial, options]);
  const [index, setIndex] = useState(fallbackIndex);

  useEffect(() => {
    if (explicitInitial) return;
    try {
      const storedIndex = findToolIndex(options, localStorage.getItem(STORAGE_KEY));
      if (storedIndex >= 0) setIndex(storedIndex);
    } catch {
      // Storage can be unavailable in hardened/private browser contexts.
    }
  }, [explicitInitial, options]);

  useEffect(() => {
    const applyPreference = (value: string | null) => {
      const nextIndex = findToolIndex(options, value);
      if (nextIndex >= 0) setIndex(nextIndex);
    };

    const onPreference = (event: Event) => {
      applyPreference((event as CustomEvent<{ label?: string }>).detail?.label ?? null);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) applyPreference(event.newValue);
    };
    const syncFromTabs = () => {
      const selected = document.querySelector<HTMLElement>(
        'starlight-tabs[data-sync-key="tool"] [role="tab"][aria-selected="true"]'
      );
      if (selected?.textContent) applyPreference(selected.textContent.trim());
    };

    window.addEventListener(TOOL_PREFERENCE_EVENT, onPreference);
    window.addEventListener('storage', onStorage);
    const observer = new MutationObserver(syncFromTabs);
    for (const tabs of document.querySelectorAll('starlight-tabs[data-sync-key="tool"]')) {
      observer.observe(tabs, {
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-selected'],
      });
    }

    return () => {
      window.removeEventListener(TOOL_PREFERENCE_EVENT, onPreference);
      window.removeEventListener('storage', onStorage);
      observer.disconnect();
    };
  }, [options]);

  const selectIndex = useCallback((nextIndex: number) => {
    const option = options[nextIndex];
    if (!option) return;
    setIndex(nextIndex);
    try {
      localStorage.setItem(STORAGE_KEY, option.label);
    } catch {
      // The in-memory selection still works when storage is unavailable.
    }
    window.dispatchEvent(
      new CustomEvent(TOOL_PREFERENCE_EVENT, { detail: { label: option.label } })
    );
  }, [options]);

  return [index, selectIndex] as const;
}
