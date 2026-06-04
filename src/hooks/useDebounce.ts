import { useCallback, useEffect, useRef, useState } from 'react'

// ─── useDebounce ──────────────────────────────────────────────────────────────

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms of
 * inactivity. Cleans up the pending timeout on unmount.
 *
 * @template T - Type of the value being debounced
 * @param value - The reactive value to debounce
 * @param delay - Debounce delay in milliseconds (default: 300)
 * @returns The debounced value
 *
 * @example
 * const [query, setQuery] = useState('')
 * const debouncedQuery = useDebounce(query, 400)
 *
 * useEffect(() => {
 *   if (debouncedQuery) fetchResults(debouncedQuery)
 * }, [debouncedQuery])
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// ─── useDebouncedCallback ─────────────────────────────────────────────────────

// Allow any function signature — intentional use of `any` here is unavoidable
// for a generic callback debouncer. eslint-disable keeps it explicit.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any

/**
 * Returns a stable, debounced version of `fn` that fires only after `delay` ms
 * have elapsed since the last invocation. The returned function has the same
 * signature as `fn` and is guaranteed stable across renders (safe as a dep).
 *
 * Cleans up any pending invocation on unmount.
 *
 * @param fn    - The handler to debounce
 * @param delay - Debounce delay in milliseconds (default: 300)
 * @returns Debounced version of `fn`
 *
 * @example
 * const handleSearch = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
 *   trackSearch(e.target.value)
 * }, 400)
 */
export function useDebouncedCallback<T extends AnyFn>(
  fn: T,
  delay: number = 300,
): (...args: Parameters<T>) => void {
  // Keep fn in a ref so callers don't need to memoize it themselves
  const fnRef = useRef<T>(fn)
  fnRef.current = fn

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cancel on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return useCallback((...args: Parameters<T>) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      fnRef.current(...args)
    }, delay)
  }, [delay])
}
