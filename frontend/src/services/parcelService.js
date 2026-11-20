import { API_BASE_URL } from './api';

export class TrackingApiError extends Error {
  constructor(message, status, type) {
    super(message);
    this.name = 'TrackingApiError';
    this.status = status;
    this.type = type; // 'NOT_FOUND', 'NETWORK_ERROR', 'SERVER_ERROR', 'VALIDATION_ERROR', 'CLIENT_ERROR'
  }
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

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/parcels/${encodeURIComponent(cleanId)}`);
  } catch {
    throw new TrackingApiError(
      'Unable to connect to the tracking server. Please verify the backend service is running.',
      0,
      'NETWORK_ERROR'
    );
  }

  if (response.status === 404) {
    const errorData = await response.json().catch(() => ({}));
    throw new TrackingApiError(
      errorData.detail || `Parcel with tracking ID "${cleanId}" was not found. Please verify the code and try again.`,
      404,
      'NOT_FOUND'
    );
  }

  if (response.status >= 500) {
    const errorData = await response.json().catch(() => ({}));
    throw new TrackingApiError(
      errorData.detail || 'The tracking service encountered an internal server error. Please try again later.',
      response.status,
      'SERVER_ERROR'
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new TrackingApiError(
      errorData.detail || `Request failed with HTTP status ${response.status}.`,
      response.status,
      'CLIENT_ERROR'
    );
  }

  return response.json();
}
