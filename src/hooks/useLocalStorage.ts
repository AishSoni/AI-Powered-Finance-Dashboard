import { useCallback, useEffect, useState } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

/** All localStorage keys are prefixed with this namespace. */
const KEY_PREFIX = 'pf-' as const

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Setter that accepts either a direct value or an updater function,
 * mirroring the signature of `React.Dispatch<React.SetStateAction<T>>`.
 */
export type SetValue<T> = (value: T | ((prev: T) => T)) => void

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readFromStorage<T>(namespacedKey: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(namespacedKey)
    return raw !== null ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeToStorage<T>(namespacedKey: string, value: T): void {
  try {
    window.localStorage.setItem(namespacedKey, JSON.stringify(value))
  } catch {
    // Quota exceeded or private-browsing restrictions — silently ignore
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * A type-safe `localStorage` hook with cross-tab sync and automatic
 * "pf-" namespace prefixing for all Proton Finance keys.
 *
 * @template T - Type of the stored value (must be JSON-serialisable)
 * @param key          - Storage key (will be stored as `pf-{key}`)
 * @param initialValue - Value used when the key is absent or unreadable
 * @returns `[storedValue, setValue, reset]`
 *   - `storedValue` — current value
 *   - `setValue`    — set a new value (or pass an updater function)
 *   - `reset`       — restore to `initialValue` and remove from storage
 *
 * @example
 * const [theme, setTheme, resetTheme] = useLocalStorage('theme', 'dark')
 * // stored under key "pf-theme"
 *
 * setTheme('light')
 * setTheme(prev => prev === 'dark' ? 'light' : 'dark')
 * resetTheme() // back to 'dark', key removed from localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, SetValue<T>, () => void] {
  const namespacedKey = `${KEY_PREFIX}${key}`

  const [storedValue, setStoredValue] = useState<T>(() =>
    readFromStorage(namespacedKey, initialValue),
  )

  // ── Setter ────────────────────────────────────────────────────────────────
  const setValue: SetValue<T> = useCallback((value) => {
    setStoredValue((prev) => {
      const next = typeof value === 'function'
        ? (value as (prev: T) => T)(prev)
        : value
      writeToStorage(namespacedKey, next)
      return next
    })
  }, [namespacedKey])

  // ── Reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(namespacedKey)
    } catch {
      // ignore
    }
    setStoredValue(initialValue)
  // initialValue intentionally excluded from deps — we want the value
  // captured at hook initialisation (acts like a stable "default").
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespacedKey])

  // ── Cross-tab sync ────────────────────────────────────────────────────────
  useEffect(() => {
    const onStorageEvent = (event: StorageEvent) => {
      if (event.key !== namespacedKey || event.storageArea !== window.localStorage) return

      if (event.newValue === null) {
        // Key was removed in another tab
        setStoredValue(initialValue)
      } else {
        try {
          setStoredValue(JSON.parse(event.newValue) as T)
        } catch {
          setStoredValue(initialValue)
        }
      }
    }

    window.addEventListener('storage', onStorageEvent)
    return () => window.removeEventListener('storage', onStorageEvent)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespacedKey])

  return [storedValue, setValue, reset]
}
