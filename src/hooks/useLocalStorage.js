import { useEffect, useState } from 'react';

/**
 * useLocalStorage - a custom hook that behaves like useState, but also
 * remembers the value in the browser so it survives a page refresh.
 *
 * - The function passed to useState runs only once (lazy initialiser),
 *   so we read localStorage a single time when the app starts.
 * - useEffect saves the value every time it changes.
 * - try/catch protects the app if storage is blocked (private mode, full, etc.).
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: the app keeps working from React state only */
    }
  }, [key, value]);

  return [value, setValue];
}
