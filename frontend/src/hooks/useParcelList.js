/**
 * useParcelList.js
 * Custom hook that fetches the parcel list from parcelService,
 * re-fetching whenever search, status, or refreshKey changes.
 */
import { useEffect, useState, useCallback } from 'react'
import { getParcels } from '../services/parcelService'

/**
 * @param {{ search?: string, status?: string, refreshKey?: number }} filters
 */
export function useParcelList({ search = '', status = '', refreshKey = 0 } = {}) {
  const [parcels, setParcels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(() => {
    setLoading(true)
    setError(null)
    getParcels({ search, status })
      .then(setParcels)
      .catch((e) => setError(e.message ?? 'Failed to load parcels.'))
      .finally(() => setLoading(false))
  }, [search, status, refreshKey])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch()
  }, [fetch])

  return { parcels, loading, error, refresh: fetch }
}
