import { API_BASE_URL } from './api';

export class TrackingApiError extends Error {
  constructor(message, status, type, fieldErrors = null) {
    super(message);
    this.name = 'TrackingApiError';
    this.status = status;
    this.type = type; // 'NOT_FOUND', 'NETWORK_ERROR', 'SERVER_ERROR', 'VALIDATION_ERROR', 'CLIENT_ERROR'
    this.fieldErrors = fieldErrors;
  }
}

function parseErrorDetail(detail, fallbackMessage) {
  if (typeof detail === 'string' && detail.trim()) {
    return { message: detail.trim(), fieldErrors: null };
  }
  if (Array.isArray(detail) && detail.length > 0) {
    const fieldErrors = {};
    const messages = [];
    detail.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const msg =
        typeof item.msg === 'string'
          ? item.msg.replace(/^Value error,\s*/i, '')
          : 'Invalid value';
      const loc = Array.isArray(item.loc) ? item.loc : [];
      const fieldKey = loc.length > 0 ? String(loc[loc.length - 1]) : null;
      if (fieldKey && fieldKey !== 'body') {
        fieldErrors[fieldKey] = msg;
        messages.push(`${fieldKey.replace(/_/g, ' ')}: ${msg}`);
      } else {
        messages.push(msg);
      }
    });
    return {
      message: messages.length > 0 ? messages.join(' • ') : fallbackMessage,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : null,
    };
  }
  return { message: fallbackMessage, fieldErrors: null };
}

/**
 * Shared JSON request helper with uniform API error classification.
 */
async function requestJson(
  path,
  {
    networkErrorMessage = 'Unable to connect to the ParcelTrack server. Please verify the backend service is running.',
    notFoundMessage = 'The requested resource was not found.',
    serverErrorMessage = 'The ParcelTrack service encountered an internal server error. Please try again later.',
    validationErrorMessage = 'Please check the submitted information and try again.',
    options = {},
  } = {}
) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new TrackingApiError(networkErrorMessage, 0, 'NETWORK_ERROR');
  }

  if (response.status === 404) {
    const errorData = await response.json().catch(() => ({}));
    const { message } = parseErrorDetail(errorData.detail, notFoundMessage);
    throw new TrackingApiError(message, 404, 'NOT_FOUND');
  }

  if (response.status === 400 || response.status === 422) {
    const errorData = await response.json().catch(() => ({}));
    const { message, fieldErrors } = parseErrorDetail(
      errorData.detail,
      validationErrorMessage
    );
    throw new TrackingApiError(message, response.status, 'VALIDATION_ERROR', fieldErrors);
  }

  if (response.status >= 500) {
    const errorData = await response.json().catch(() => ({}));
    const { message } = parseErrorDetail(errorData.detail, serverErrorMessage);
    throw new TrackingApiError(message, response.status, 'SERVER_ERROR');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const { message } = parseErrorDetail(
      errorData.detail,
      `Request failed with HTTP status ${response.status}.`
    );
    throw new TrackingApiError(message, response.status, 'CLIENT_ERROR');
  }

  return response.json();
}

/**
 * Public parcel tracking API service.
 * Consumes GET /api/parcels/{tracking_id}.
 * Strictly excludes any personal names or phone numbers.
 */
export async function fetchParcelTracking(trackingId) {
  const cleanId = (trackingId || '').trim().toUpperCase();
  if (!cleanId) {
    throw new TrackingApiError('Please enter a tracking number.', 400, 'VALIDATION_ERROR');
  }

  return requestJson(`/api/parcels/${encodeURIComponent(cleanId)}`, {
    networkErrorMessage:
      'Unable to connect to the tracking server. Please verify the backend service is running.',
    notFoundMessage: `Parcel with tracking ID "${cleanId}" was not found. Please verify the code and try again.`,
    serverErrorMessage:
      'The tracking service encountered an internal server error. Please try again later.',
  });
}

/**
 * Agency dashboard summary metrics.
 * Consumes GET /api/parcels/stats/summary.
 * Returns: { total, registered, in_transit, arrived, collected }
 */
export async function getDashboardStats() {
  return requestJson('/api/parcels/stats/summary', {
    networkErrorMessage:
      'Unable to load dashboard summary. Please verify the backend service is running.',
    serverErrorMessage:
      'The server encountered an error while computing dashboard metrics. Please try again.',
  });
}

/**
 * Agency parcels manifest list (ordered newest first by backend).
 * Consumes GET /api/parcels.
 * Returns: Array<ParcelResponse>
 */
export async function listParcels() {
  return requestJson('/api/parcels', {
    networkErrorMessage:
      'Unable to load parcels. Please verify the backend service is running.',
    serverErrorMessage:
      'The server encountered an error while loading parcels. Please try again.',
  });
}

/**
 * Register a new parcel at the agency intake desk (POST /api/parcels).
 */
export async function createParcel(payload) {
  return requestJson('/api/parcels', {
    networkErrorMessage:
      'Unable to reach the server to register this parcel. Please verify the backend service is running.',
    validationErrorMessage:
      'Some parcel registration fields are invalid. Please review the highlighted fields.',
    serverErrorMessage:
      'The server encountered an error while registering the parcel. Please try again.',
    options: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  });
}

/**
 * Advance parcel lifecycle status (PATCH /api/parcels/{tracking_id}/status).
 * Normalizes blank/whitespace note to null per ParcelStatusUpdate schema validator.
 */
export async function updateParcelStatus(trackingId, payload) {
  const cleanId = (trackingId || '').trim().toUpperCase();
  if (!cleanId) {
    throw new TrackingApiError('Tracking ID is required.', 400, 'VALIDATION_ERROR');
  }

  const trimmedNote = typeof payload?.note === 'string' ? payload.note.trim() : '';
  const requestBody = {
    status: payload?.status,
    note: trimmedNote.length > 0 ? trimmedNote : null,
  };

  return requestJson(`/api/parcels/${encodeURIComponent(cleanId)}/status`, {
    networkErrorMessage:
      'Unable to connect to the server to update parcel status. Please verify the backend service is running.',
    notFoundMessage: `Parcel with tracking ID "${cleanId}" was not found.`,
    validationErrorMessage:
      'This status transition is not valid for the parcel’s current lifecycle stage.',
    serverErrorMessage:
      'The server encountered an error while updating the parcel status. Please try again.',
    options: {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    },
  });
}

/**
 * Agency parcel detail lookup (GET /api/parcels/{tracking_id}).
 * Optionally enriches sender/recipient contact details from listParcels()
 * without failing if omitted or unavailable.
 */
export async function getAgencyParcelDetail(trackingId) {
  const cleanId = (trackingId || '').trim().toUpperCase();
  if (!cleanId) {
    throw new TrackingApiError('Tracking ID is required.', 400, 'VALIDATION_ERROR');
  }

  const detail = await requestJson(`/api/parcels/${encodeURIComponent(cleanId)}`, {
    networkErrorMessage:
      'Unable to load parcel details. Please verify the backend service is running.',
    notFoundMessage: `Parcel with tracking ID "${cleanId}" was not found.`,
    serverErrorMessage:
      'The server encountered an error while loading parcel details. Please try again.',
  });

  if (!detail.sender_name && !detail.recipient_name) {
    try {
      const allParcels = await listParcels();
      if (Array.isArray(allParcels)) {
        const match = allParcels.find(
          (item) => (item?.tracking_id || '').trim().toUpperCase() === cleanId
        );
        if (match) {
          return {
            ...detail,
            id: match.id ?? detail.id,
            sender_name: match.sender_name,
            sender_phone: match.sender_phone,
            recipient_name: match.recipient_name,
            recipient_phone: match.recipient_phone,
          };
        }
      }
    } catch {
      // Optional enrichment should never fail the primary detail lookup
    }
  }

  return detail;
}
