/**
 * formatters.js — shared display helpers
 * Currency uses XAF (CFA Franc) as defined in the project README.
 */

/** Format a number as CFA Francs */
export function formatXAF(amount) {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format an ISO date string to a readable local date + time */
export function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Human-readable status labels */
export const STATUS_LABELS = {
  registered: 'Registered',
  in_transit: 'In Transit',
  arrived: 'Arrived',
  collected: 'Collected',
}

/** Tailwind badge class per status (matches index.css components) */
export function statusBadgeClass(status) {
  const map = {
    registered: 'badge-registered',
    in_transit: 'badge-in_transit',
    arrived: 'badge-arrived',
    collected: 'badge-collected',
  }
  return map[status] ?? 'badge-registered'
}

/** All valid status options for the filter select */
export const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'registered', label: 'Registered' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'arrived', label: 'Arrived' },
  { value: 'collected', label: 'Collected' },
]

/** List of common Cameroon city pairs served by the agency */
export const CITY_OPTIONS = [
  'Douala',
  'Yaoundé',
  'Bamenda',
  'Bafoussam',
  'Ngaoundéré',
  'Garoua',
  'Maroua',
  'Buea',
  'Limbe',
  'Kribi',
]
