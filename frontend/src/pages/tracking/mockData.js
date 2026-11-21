import { PARCEL_STATUS } from './types.js';

/**
 * Mock tracking dataset for development and client-side testing.
 * Includes the Cameroon inter-city route (Douala ↔ Bamenda) as described in the project
 * problem statement and DEMO_FLOW.md, as well as reference IDs matching Stitch exports.
 */
export const MOCK_PARCELS = {
  // Reference shipment matching Google Stitch design (In Transit)
  'PT-2026-001': {
    trackingNumber: 'PT-2026-001',
    status: PARCEL_STATUS.IN_TRANSIT,
    registrationDate: 'Nov 18, 2026 · 09:15 AM',
    expectedArrival: 'Nov 21, 2026 (Estimated)',
    expectedArrivalShort: 'Nov 21, 2026',
    senderName: 'Elena Vance',
    recipientName: 'Marcus Cole',
    recipientPhone: '+237 671 234 567',
    origin: 'Douala Central Agency (Akwa)',
    destination: 'Bamenda Commercial Hub (Up Station)',
    pickupBranch: 'Bamenda Up Station Hub - Counter 2',
    pickupHours: 'Mon - Sat: 07:30 AM - 06:00 PM',
    weightKg: 4.5,
    packageType: 'Electronics / Fragile Box',
    timeline: [
      {
        status: PARCEL_STATUS.REGISTERED,
        timestamp: 'Nov 18, 2026 · 09:15 AM',
        location: 'Douala Central Agency',
        note: 'Package weighed, tagged, and registered at dispatch counter.',
      },
      {
        status: PARCEL_STATUS.IN_TRANSIT,
        timestamp: 'Nov 19, 2026 · 02:30 PM',
        location: 'Douala ↔ Bafoussam ↔ Bamenda Corridor',
        note: 'Dispatched aboard express cargo transport vehicle #CM-741-LT.',
      },
    ],
  },

  // Demonstration package in ARRIVED state (Ready for recipient pickup)
  'PT-DLA-BDA-001': {
    trackingNumber: 'PT-DLA-BDA-001',
    status: PARCEL_STATUS.ARRIVED,
    registrationDate: 'Nov 19, 2026 · 08:30 AM',
    expectedArrival: 'Nov 20, 2026 (Arrived)',
    expectedArrivalShort: 'Ready for Pickup',
    senderName: 'Tanyi Roland (Douala)',
    recipientName: 'Nfor Brenda (Bamenda)',
    recipientPhone: '+237 675 889 900',
    origin: 'Douala Agency (Bonaberi Branch)',
    destination: 'Bamenda Agency (Commercial Avenue)',
    pickupBranch: 'Bamenda Commercial Avenue Branch — Counter 1',
    pickupHours: 'Mon - Sat: 08:00 AM - 06:30 PM',
    weightKg: 2.8,
    packageType: 'Document Envelope & Goods',
    timeline: [
      {
        status: PARCEL_STATUS.REGISTERED,
        timestamp: 'Nov 19, 2026 · 08:30 AM',
        location: 'Douala Bonaberi Agency',
        note: 'Intake completed and tracking ID assigned.',
      },
      {
        status: PARCEL_STATUS.IN_TRANSIT,
        timestamp: 'Nov 19, 2026 · 01:00 PM',
        location: 'En route to Western Highlands',
        note: 'Departed Douala transit depot.',
      },
      {
        status: PARCEL_STATUS.ARRIVED,
        timestamp: 'Nov 20, 2026 · 04:45 PM',
        location: 'Bamenda Commercial Avenue Agency',
        note: 'Package unloaded, scanned into holding room, arrival SMS queued.',
      },
    ],
  },

  // Demonstration package in REGISTERED state
  'PT-DLA-BDA-002': {
    trackingNumber: 'PT-DLA-BDA-002',
    status: PARCEL_STATUS.REGISTERED,
    registrationDate: 'Nov 21, 2026 · 04:10 AM',
    expectedArrival: 'Nov 22, 2026 (Estimated)',
    expectedArrivalShort: 'Nov 22, 2026',
    senderName: 'Kouam Samuel',
    recipientName: 'Bih Florence',
    recipientPhone: '+237 699 112 233',
    origin: 'Douala Central Agency (Akwa)',
    destination: 'Bamenda Commercial Hub',
    pickupBranch: 'Bamenda Up Station Hub',
    pickupHours: 'Mon - Sat: 07:30 AM - 06:00 PM',
    weightKg: 12.0,
    packageType: 'Textiles & Garments Sacks',
    timeline: [
      {
        status: PARCEL_STATUS.REGISTERED,
        timestamp: 'Nov 21, 2026 · 04:10 AM',
        location: 'Douala Akwa Branch',
        note: 'Intake registered by Desk Operator. Sorting for next morning departure.',
      },
    ],
  },

  // Demonstration package in COLLECTED state
  'PT-DLA-BDA-003': {
    trackingNumber: 'PT-DLA-BDA-003',
    status: PARCEL_STATUS.COLLECTED,
    registrationDate: 'Nov 15, 2026 · 10:00 AM',
    expectedArrival: 'Nov 17, 2026 (Delivered)',
    expectedArrivalShort: 'Completed',
    senderName: 'Fonkeng Divine',
    recipientName: 'Mbah Patrick',
    recipientPhone: '+237 670 445 566',
    origin: 'Douala Central Agency (Akwa)',
    destination: 'Bamenda Commercial Hub',
    pickupBranch: 'Bamenda Commercial Hub',
    pickupHours: 'Mon - Sat: 07:30 AM - 06:00 PM',
    weightKg: 1.5,
    packageType: 'Spare Automotive Parts',
    timeline: [
      {
        status: PARCEL_STATUS.REGISTERED,
        timestamp: 'Nov 15, 2026 · 10:00 AM',
        location: 'Douala Central Agency',
        note: 'Registered at agency desk.',
      },
      {
        status: PARCEL_STATUS.IN_TRANSIT,
        timestamp: 'Nov 15, 2026 · 03:00 PM',
        location: 'Highway Transit',
        note: 'Dispatched to destination.',
      },
      {
        status: PARCEL_STATUS.ARRIVED,
        timestamp: 'Nov 16, 2026 · 06:00 PM',
        location: 'Bamenda Agency',
        note: 'Stored at pickup desk.',
      },
      {
        status: PARCEL_STATUS.COLLECTED,
        timestamp: 'Nov 17, 2026 · 11:20 AM',
        location: 'Bamenda Agency Counter',
        note: 'Released to recipient upon national ID verification.',
      },
    ],
  },
};

/**
 * Service function to retrieve tracking details.
 * Tries the real backend REST API if available (`/api/v1/tracking/{id}`),
 * and transparently falls back to mock data so the screen can be tested
 * and demonstrated before the backend or database are configured.
 *
 * @param {string} trackingNumber
 * @returns {Promise<object>} Parcel details object
 */
export async function fetchTrackingInfo(trackingNumber) {
  const cleanId = (trackingNumber || '').trim().toUpperCase();
  if (!cleanId) {
    throw new Error('Please enter a valid tracking number.');
  }

  // 1. Attempt live API call if backend is running
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const response = await fetch(`/api/v1/tracking/${encodeURIComponent(cleanId)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    if (response.status === 404) {
      // If server explicitly returned 404, check mock fallback below
    }
  } catch (err) {
    // API is not running or timed out; smoothly fall back to mock data
  }

  // 2. Simulate network latency for a realistic loading feel
  await new Promise((resolve) => setTimeout(resolve, 600));

  // 3. Return matching mock parcel or throw Not Found
  const parcel = MOCK_PARCELS[cleanId];
  if (!parcel) {
    const error = new Error(`Parcel with tracking number "${cleanId}" was not found.`);
    error.status = 404;
    error.trackingNumber = cleanId;
    throw error;
  }

  return parcel;
}
