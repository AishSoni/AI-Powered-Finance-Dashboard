import { useCallback, useEffect, useReducer, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
  attempt: number
}

type FetchAction<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'RESET' }

/** Delays ms for exponential backoff: attempt 1 → 500ms, 2 → 1000ms, 3 → 2000ms */
const BACKOFF_DELAYS = [500, 1000, 2000] as const
const MAX_ATTEMPTS = 3

// ─── Reducer ──────────────────────────────────────────────────────────────────

function fetchReducer<T>(
  state: FetchState<T>,
  action: FetchAction<T>,
): FetchState<T> {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null, attempt: state.attempt + 1 }
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null, attempt: 0 }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'RESET':
      return { data: null, loading: false, error: null, attempt: 0 }
    default:
      return state
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Generic data-fetching hook with automatic retry (exponential backoff).
 *
 * @template T - Shape of the resolved data
 * @param fetcher - Async function that resolves to `T`
 * @param deps    - Dependency array that re-triggers the fetch (default: `[]`)
 * @returns `{ data, loading, error, refetch }`
 *
 * @example
 * const { data, loading, error, refetch } = useFetch(
 *   () => fetch('/api/portfolio').then(r => r.json()),
 *   [clientId]
 * )
 */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
): UseFetchResult<T> {
  const initialState: FetchState<T> = {
    data: null,
    loading: false,
    error: null,
    attempt: 0,
  }

  const [state, dispatch] = useReducer(
    (s: FetchState<T>, a: FetchAction<T>) => fetchReducer(s, a),
    initialState,
  )

  // Stable ref to the fetcher so the effect dep array stays clean
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  // Used to bail out of state updates after unmount
  const isMountedRef = useRef(true)
  // Tracks retry timeout so we can cancel it on unmount
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const execute = useCallback(async (currentAttempt: number = 0) => {
    if (!isMountedRef.current) return

    dispatch({ type: 'FETCH_START' })

    try {
      const result = await fetcherRef.current()
      if (isMountedRef.current) dispatch({ type: 'FETCH_SUCCESS', payload: result })
    } catch (err) {
      if (!isMountedRef.current) return

      const nextAttempt = currentAttempt + 1

      if (nextAttempt < MAX_ATTEMPTS) {
        const delay = BACKOFF_DELAYS[currentAttempt] ?? BACKOFF_DELAYS[BACKOFF_DELAYS.length - 1]
        retryTimeoutRef.current = setTimeout(() => execute(nextAttempt), delay)
      } else {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred'
        dispatch({ type: 'FETCH_ERROR', payload: message })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    execute(0)

    return () => {
      isMountedRef.current = false
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
      dispatch({ type: 'RESET' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const refetch = useCallback(() => {
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    execute(0)
  }, [execute])

  return { data: state.data, loading: state.loading, error: state.error, refetch }
}
