import { FIELDS as F, DONE_STATUS, STATUSES } from "../../services/schema";

export default function StatsCards({ parcels }) {
  const count = (s) => parcels.filter((p) => p[F.status] === s).length;
  const cards = [
    { label: "Total parcels", value: parcels.length, color: "border-l-[#00288e]" },
    { label: "In transit", value: count("IN_TRANSIT"), color: "border-l-[#3755c3]" },
    { label: "Arrived", value: count("ARRIVED"), color: "border-l-[#16a34a]" },
    { label: STATUSES.find((x) => x.value === DONE_STATUS)?.label, value: count(DONE_STATUS), color: "border-l-[#757684]" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-xl border border-[#dce9ff] border-l-4 ${c.color} bg-white p-4`}>
          <div className="text-3xl font-semibold text-[#0b1c30]">{c.value}</div>
          <div className="text-sm text-[#565e74]">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
