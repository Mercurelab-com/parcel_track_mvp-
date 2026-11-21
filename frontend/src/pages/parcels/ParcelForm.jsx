import { useState } from "react";
import { FIELDS as F, CITIES } from "../../services/schema";
import { validateParcel } from "../../utils/validation";

const empty = {
  [F.senderName]: "", [F.senderPhone]: "", [F.recipientName]: "", [F.recipientPhone]: "",
  [F.origin]: CITIES[0], [F.destination]: CITIES[1], [F.description]: "",
};

export default function ParcelForm({ onCreate }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const found = validateParcel(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
      const parcel = await onCreate(payload);
      setMessage(`Parcel registered: ${parcel[F.trackingId]}`);
      setForm(empty);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  const field = (key, label, props = {}) => (
    <label className="flex flex-col gap-1 text-sm text-[#565e74]">
      {label}
      <input
        className="rounded-md border border-[#c4c5d5] px-3 py-2 text-[#0b1c30] focus:outline-2 focus:outline-[#00288e]"
        value={form[key]} onChange={set(key)} {...props}
      />
      <span className="min-h-4 text-xs text-red-600">{errors[key]}</span>
    </label>
  );

  const select = (key, label) => (
    <label className="flex flex-col gap-1 text-sm text-[#565e74]">
      {label}
      <select className="rounded-md border border-[#c4c5d5] px-3 py-2 text-[#0b1c30]" value={form[key]} onChange={set(key)}>
        {CITIES.map((c) => <option key={c}>{c}</option>)}
      </select>
      <span className="min-h-4 text-xs text-red-600">{errors[key]}</span>
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="rounded-xl border border-[#dce9ff] bg-white p-5">
      <h2 className="mb-3 text-base font-semibold text-[#0b1c30]">Register a parcel</h2>
      <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
        {field(F.senderName, "Sender name")}
        {field(F.senderPhone, "Sender phone", { inputMode: "tel", placeholder: "677123456" })}
        {field(F.recipientName, "Recipient name")}
        {field(F.recipientPhone, "Recipient phone", { inputMode: "tel", placeholder: "677123456" })}
        {select(F.origin, "Origin")}
        {select(F.destination, "Destination")}
        {field(F.description, "Contents and weight", { placeholder: "e.g. Box of clothes, 5 kg" })}
      </div>
      <div className="flex items-center gap-4">
        <button disabled={busy} className="rounded-md bg-[#00288e] px-4 py-2 font-medium text-white hover:bg-[#1e40af] disabled:opacity-60">
          {busy ? "Registering…" : "Register parcel"}
        </button>
        <span className="text-sm text-[#00288e]" role="status">{message}</span>
      </div>
    </form>
  );
}
