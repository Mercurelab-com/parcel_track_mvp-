import { FIELDS as F, STATUSES } from "../../services/schema";
import { formatDate } from "../../utils/format";

export default function ParcelTable({ parcels, loading, error }) {
  if (loading) return <p className="p-6 text-center text-[#565e74]">Loading parcels…</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!parcels.length) return <p className="p-6 text-center text-[#565e74]">No parcels match. Register one above.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="text-[#565e74]">
          <tr>{["Tracking ID", "Recipient", "Route", "Registered", "Status"].map((h) => <th key={h} className="px-2 py-2 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody>
          {parcels.map((p) => {
            const s = STATUSES.find((x) => x.value === p[F.status]);
            return (
              <tr key={p[F.trackingId]} className="border-t border-[#e5eeff]">
                <td className="px-2 py-2 font-mono font-semibold text-[#00288e]">{p[F.trackingId]}</td>
                <td className="px-2 py-2">{p[F.recipientName]}<div className="text-xs text-[#565e74]">{p[F.recipientPhone]}</div></td>
                <td className="px-2 py-2">{p[F.origin]} → {p[F.destination]}</td>
                <td className="px-2 py-2">{formatDate(p[F.createdAt])}</td>
                <td className="px-2 py-2"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s?.badge}`}>{s?.label ?? p[F.status]}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
