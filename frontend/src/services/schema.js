// Matches docs/API_CONTRACT.md (snake_case fields, /api prefix, 4 statuses).
export const FIELDS = {
  trackingId: "tracking_id",
  senderName: "sender_name",
  senderPhone: "sender_phone",
  recipientName: "recipient_name",
  recipientPhone: "recipient_phone",
  origin: "origin",
  destination: "destination",
  description: "description",
  status: "status",
  createdAt: "created_at",
  updatedAt: "updated_at",
};

export const STATUSES = [
  { value: "REGISTERED", label: "Registered", badge: "bg-[#e5eeff] text-[#444653]" },
  { value: "IN_TRANSIT", label: "In transit", badge: "bg-[#dde1ff] text-[#173bab]" },
  { value: "ARRIVED", label: "Arrived", badge: "bg-emerald-100 text-emerald-800" },
  { value: "COLLECTED", label: "Collected", badge: "bg-[#dce9ff] text-[#565e74]" },
];
export const DONE_STATUS = "COLLECTED";

export const CITIES = ["Douala", "Bamenda", "Yaoundé", "Bafoussam"];
export const CITY_CODES = { Douala: "DLA", Bamenda: "BAM", Yaoundé: "YDE", Bafoussam: "BAF" };

export const ENDPOINTS = { list: "/api/parcels", create: "/api/parcels" };
