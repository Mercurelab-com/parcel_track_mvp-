import { FIELDS as F } from "../services/schema";

// Cameroon mobile: 9 digits starting with 6, optional +237 / 237 prefix
export function isValidPhone(value = "") {
  return /^(\+?237)?6\d{8}$/.test(value.replace(/[\s-]/g, ""));
}

export function validateParcel(form) {
  const e = {};
  const name = (k) => (form[k] || "").trim().length >= 2;
  if (!name(F.senderName)) e[F.senderName] = "Enter the sender's full name (2+ characters).";
  if (!isValidPhone(form[F.senderPhone])) e[F.senderPhone] = "Enter a valid phone number, e.g. 677123456.";
  if (!name(F.recipientName)) e[F.recipientName] = "Enter the recipient's full name (2+ characters).";
  if (!isValidPhone(form[F.recipientPhone])) e[F.recipientPhone] = "Enter a valid phone number, e.g. 677123456.";
  if (form[F.origin] === form[F.destination]) e[F.destination] = "Origin and destination must be different.";
  if (!(form[F.description] || "").trim()) e[F.description] = "Describe the parcel contents.";
  return e;
}
