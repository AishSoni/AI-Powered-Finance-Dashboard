import { useCallback, useEffect, useReducer, useRef, type DependencyList } from 'react'

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

const BACKOFF_DELAYS = [500, 1000, 2000] as const
const MAX_ATTEMPTS = 3

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

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

export interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList = [],
): UseFetchResult<T> {
  const initialState: FetchState<T> = {
    data: null,
    loading: false,
    error: null,
    attempt: 0,
  }

  const [state, dispatch] = useReducer(
    (currentState: FetchState<T>, action: FetchAction<T>) => fetchReducer(currentState, action),
    initialState,
  )

  const isMountedRef = useRef(true)
  const requestIdRef = useRef(0)

  const execute = useCallback(async () => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    dispatch({ type: 'FETCH_START' })

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      try {
        const result = await fetcher()
        if (isMountedRef.current && requestIdRef.current === requestId) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result })
        }
        return
      } catch (error) {
        if (attempt < MAX_ATTEMPTS - 1) {
          await delay(BACKOFF_DELAYS[attempt] ?? BACKOFF_DELAYS[BACKOFF_DELAYS.length - 1])
          continue
        }

        if (isMountedRef.current && requestIdRef.current === requestId) {
          const message = error instanceof Error ? error.message : 'An unexpected error occurred'
          dispatch({ type: 'FETCH_ERROR', payload: message })
        }
      }
    }
  }, [fetcher])

  useEffect(() => {
    isMountedRef.current = true
    execute()

    return () => {
      isMountedRef.current = false
      requestIdRef.current += 1
      dispatch({ type: 'RESET' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, ...deps])

  const refetch = useCallback(() => {
    void execute()
  }, [execute])

  return { data: state.data, loading: state.loading, error: state.error, refetch }
}
