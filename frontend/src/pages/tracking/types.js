/**
 * Tracking module constants and status definitions.
 * Follows the 4 mandatory lifecycle statuses:
 * - REGISTERED
 * - IN_TRANSIT
 * - ARRIVED
 * - COLLECTED
 */

export const PARCEL_STATUS = {
  REGISTERED: 'REGISTERED',
  IN_TRANSIT: 'IN_TRANSIT',
  ARRIVED: 'ARRIVED',
  COLLECTED: 'COLLECTED',
};

export const STATUS_METADATA = {
  [PARCEL_STATUS.REGISTERED]: {
    key: 'REGISTERED',
    label: 'Registered',
    stepOrder: 1,
    icon: 'inventory_2',
    colorText: 'text-primary',
    bgBadge: 'bg-primary-container',
    textBadge: 'text-on-primary-container',
    summaryTitle: 'Parcel Registered',
    summaryDesc: 'Your shipment has been received and registered at the origin agency counter.',
    timelineDesc: 'Parcel registered at the agency.',
  },
  [PARCEL_STATUS.IN_TRANSIT]: {
    key: 'IN_TRANSIT',
    label: 'In Transit',
    stepOrder: 2,
    icon: 'local_shipping',
    colorText: 'text-secondary',
    bgBadge: 'bg-secondary-container',
    textBadge: 'text-on-secondary-container',
    summaryTitle: 'In Transit',
    summaryDesc: 'Your parcel is currently on its way to its destination agency.',
    timelineDesc: 'Parcel dispatched and travelling to its destination.',
  },
  [PARCEL_STATUS.ARRIVED]: {
    key: 'ARRIVED',
    label: 'Arrived at Destination',
    stepOrder: 3,
    icon: 'storefront',
    colorText: 'text-warning',
    bgBadge: 'bg-warning-container',
    textBadge: 'text-on-warning-container',
    summaryTitle: 'Ready for Pickup',
    summaryDesc: 'Your parcel has arrived at the destination agency pickup counter.',
    timelineDesc: 'Parcel arrived at the destination agency counter.',
  },
  [PARCEL_STATUS.COLLECTED]: {
    key: 'COLLECTED',
    label: 'Collected',
    stepOrder: 4,
    icon: 'task_alt',
    colorText: 'text-success',
    bgBadge: 'bg-success-container',
    textBadge: 'text-on-success-container',
    summaryTitle: 'Successfully Collected',
    summaryDesc: 'This package has been received and verified by the designated recipient.',
    timelineDesc: 'Recipient collected the parcel.',
  },
};
