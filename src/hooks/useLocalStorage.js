import { useEffect, useState } from 'react';

/**
 * State that survives a page reload. Falls back to plain state when storage is
 * unavailable (private mode / blocked cookies) so the store never breaks.
 *
 * `sanitize` runs on whatever comes back from storage. Storage is user-editable,
 * so nothing read from it is trusted as-is — prices and quantities are always
 * re-derived from the catalogue before they reach the UI or an order message.
 */
export default function useLocalStorage(key, initialValue, sanitize) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      const parsed = stored === null ? initialValue : JSON.parse(stored);
      return sanitize ? sanitize(parsed) : parsed;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable — keep working in memory only.
    }
  }, [key, value]);

  return [value, setValue];
}
