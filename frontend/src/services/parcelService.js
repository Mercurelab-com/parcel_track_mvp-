/**
 * parcelService.js — data access for the Agency Dashboard / Parcel Registration module.
 * Follows docs/API_CONTRACT.md (final): base /api, plain-array list, UPPERCASE statuses,
 * backend-generated tracking_id, no weight/fee fields.
 *
 * The UI keeps using lowercase statuses ('registered', 'in_transit', 'arrived', 'collected').
 * Conversion to/from the API's UPPERCASE values happens ONLY in this file.
 *
 * Mock mode is used when VITE_API_URL is not set. To go live, set in frontend/.env:
 *   VITE_API_URL=http://localhost:8000
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const USE_MOCK = !import.meta.env.VITE_API_URL

const CITY_CODES = { Douala: 'DLA', Bamenda: 'BAM', Yaoundé: 'YDE', Bafoussam: 'BAF' }

// ─── Status conversion (UI lowercase <-> API UPPERCASE) ──────────────────────
const fromApi = (p) => ({ ...p, status: String(p.status).toLowerCase() })
const toApiStatus = (s) => String(s).toUpperCase()

// ─── Mock data ───────────────────────────────────────────────────────────────
const seed = (n, tid, sender, recipient, from, to, desc, status, created) => ({
  id: n, tracking_id: tid,
  sender_name: sender, sender_phone: '677100001',
  recipient_name: recipient, recipient_phone: '699200001',
  origin: from, destination: to, description: desc,
  status, created_at: created, updated_at: created,
})
let _mock = [
  seed(1, 'PT-BAM-8F31A2', 'Jean-Paul Mba', 'Marie Nkeng', 'Douala', 'Bamenda', 'Electronic spare parts, 3.5 kg', 'collected', '2026-11-18T08:14:00Z'),
  seed(2, 'PT-BAF-2C9D40', 'Fatima Bello', 'Samuel Fon', 'Douala', 'Bafoussam', 'Clothing and textiles, 8 kg', 'arrived', '2026-11-19T10:00:00Z'),
  seed(3, 'PT-BAM-77B1E3', 'Alain Tchoua', 'Grace Nji', 'Yaoundé', 'Bamenda', 'Medical supplies, 2 kg', 'in_transit', '2026-11-20T07:45:00Z'),
  seed(4, 'PT-YDE-5A10C9', 'Pierre Djomo', 'Hélène Atanga', 'Douala', 'Yaoundé', 'Agricultural seeds, 15 kg', 'in_transit', '2026-11-20T11:20:00Z'),
  seed(5, 'PT-DLA-91E4B7', 'Chantal Mvogo', 'Boris Kamga', 'Yaoundé', 'Douala', 'Documents and books', 'registered', '2026-11-21T01:05:00Z'),
  seed(6, 'PT-BAM-0D6F82', 'Rodrigue Essomba', 'Nadège Fouda', 'Douala', 'Bamenda', 'Household items, 10 kg', 'registered', '2026-11-21T02:00:00Z'),
]

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))
const hex6 = () => Math.random().toString(16).slice(2, 8).toUpperCase().padEnd(6, '0')

// ─── Shared helpers ──────────────────────────────────────────────────────────
function applyFilters(list, { search = '', status = '' } = {}) {
  let out = [...list]
  if (status) out = out.filter((p) => p.status === status)
  const q = search.trim().toLowerCase()
  if (q) {
    out = out.filter(
      (p) =>
        p.tracking_id.toLowerCase().includes(q) ||
        p.recipient_name.toLowerCase().includes(q) ||
        p.sender_name.toLowerCase().includes(q)
    )
  }
  return out.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

// Phones: contract examples are 9 digits (677123456). Strip spaces and +237 / 237.
const cleanPhone = (v = '') => String(v).replace(/[\s-]/g, '').replace(/^\+?237/, '')

/** Build the exact request body the contract allows. Extra form fields (weight, fee…) are dropped;
 *  weight is folded into the description so no information is lost. */
function toCreatePayload(data) {
  const weight = data.weight_kg ? `, ${data.weight_kg} kg` : ''
  return {
    sender_name: String(data.sender_name ?? '').trim(),
    sender_phone: cleanPhone(data.sender_phone),
    recipient_name: String(data.recipient_name ?? '').trim(),
    recipient_phone: cleanPhone(data.recipient_phone),
    origin: String(data.origin ?? '').trim(),
    destination: String(data.destination ?? '').trim(),
    description: `${String(data.description ?? '').trim()}${weight}`,
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    let msg = 'Request failed. Please try again.'
    try {
      const body = await res.json()
      if (typeof body.detail === 'string') msg = body.detail
      else if (Array.isArray(body.detail)) {
        msg = body.detail.map((d) => `${d.loc?.slice(-1)}: ${d.msg}`).join('; ')
      }
    } catch { /* keep default */ }
    throw new Error(msg)
  }
  return res.json()
}

// ─── Mock implementation ─────────────────────────────────────────────────────
const mock = {
  async getParcels(filters) { await delay(); return applyFilters(_mock, filters) },
  async getParcel(trackingId) {
    await delay()
    const p = _mock.find((x) => x.tracking_id === trackingId)
    if (!p) throw new Error(`Parcel with tracking ID ${trackingId} not found`)
    return p
  },
  async createParcel(data) {
    await delay(500)
    const body = toCreatePayload(data)
    const now = new Date().toISOString()
    const parcel = {
      ...body, id: _mock.length + 1,
      tracking_id: `PT-${CITY_CODES[body.destination] ?? 'XXX'}-${hex6()}`, // backend generates this in live mode
      status: 'registered', created_at: now, updated_at: now,
    }
    _mock = [parcel, ..._mock]
    return parcel
  },
}

// ─── Live implementation (FastAPI) ───────────────────────────────────────────
const live = {
  async getParcels(filters) {
    const list = await request('/api/parcels') // plain array, no query params in the contract
    return applyFilters(list.map(fromApi), filters)
  },
  async getParcel(trackingId) {
    return fromApi(await request(`/api/parcels/${encodeURIComponent(trackingId)}`))
  },
  async createParcel(data) {
    const created = await request('/api/parcels', { method: 'POST', body: JSON.stringify(toCreatePayload(data)) })
    return fromApi(created)
  },
}

const adapter = USE_MOCK ? mock : live

export const getParcels = (filters) => adapter.getParcels(filters)
export const getParcel = (trackingId) => adapter.getParcel(trackingId)
export const createParcel = (data) => adapter.createParcel(data)
export { toApiStatus } // for the status-update module (Member 5), if needed

/** Aggregate counts for StatsCards (computed from the list). */
export async function getStats() {
  const all = await adapter.getParcels()
  return {
    total: all.length,
    in_transit: all.filter((p) => p.status === 'in_transit').length,
    arrived: all.filter((p) => p.status === 'arrived').length,
    collected: all.filter((p) => p.status === 'collected').length,
  }
}
