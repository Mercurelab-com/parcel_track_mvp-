/**
 * StatsCards.jsx
 * Displays four summary cards: Total Parcels, In Transit, Arrived, Collected.
 * Receives a `stats` prop from the parent (loaded via parcelService.getStats).
 */
import { useEffect, useState } from 'react'
import { getStats } from '../../services/parcelService'

// ─── Individual card ──────────────────────────────────────────────────────────

function StatCard({ label, value, icon, colorClass, loading }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        {loading ? (
          <div className="mt-1 h-7 w-14 bg-gray-100 rounded animate-pulse" />
        ) : (
          <p className="mt-0.5 text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  )
}

// ─── Icons (inline SVG, no extra dep) ────────────────────────────────────────

const IconBox = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M20 7l-8-4-8 4m16 0v10l-8 4-8-4V7m8 4v10" />
  </svg>
)

const IconTruck = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 17a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zm-14-4h11l3-5h-14v5zM3 5h11v8H3z" />
  </svg>
)

const IconMapPin = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const IconCheck = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * @param {{ refreshKey?: number }} props
 *   refreshKey — increment to trigger a re-fetch (e.g. after a new parcel is created)
 */
export default function StatsCards({ refreshKey = 0 }) {
  const [stats, setStats] = useState({ total: 0, in_transit: 0, arrived: 0, collected: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [refreshKey])

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
        Failed to load stats: {error}
      </div>
    )
  }

  const cards = [
    {
      label: 'Total Parcels',
      value: stats.total,
      icon: <IconBox />,
      colorClass: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'In Transit',
      value: stats.in_transit,
      icon: <IconTruck />,
      colorClass: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Arrived',
      value: stats.arrived,
      icon: <IconMapPin />,
      colorClass: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Collected',
      value: stats.collected,
      icon: <IconCheck />,
      colorClass: 'bg-green-50 text-green-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} loading={loading} {...card} />
      ))}
    </div>
  )
}
