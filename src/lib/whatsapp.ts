// Builds a wa.me deep link that opens a chat to the salon's WhatsApp with a
// pre-filled booking message. The number is normalized to international
// E.164 (no "+", no spaces) as required by wa.me.

const COUNTRY_CODE = "212"; // Morocco

function normalizeNumber(raw: string | undefined): string | null {
  if (!raw) return null;
  const n = raw.replace(/[^\d]/g, "");
  if (!n) return null;

  // Strip a leading country code if it was already provided.
  if (n.startsWith(COUNTRY_CODE) && n.length > COUNTRY_CODE.length + 1) {
    return n;
  }
  // Local format starting with 0 -> drop leading 0 and prepend country code.
  if (n.startsWith("0")) {
    return COUNTRY_CODE + n.slice(1);
  }
  // Already looks international (e.g. 212XXXXXXXXX) -> keep as-is.
  if (n.startsWith(COUNTRY_CODE)) {
    return n;
  }
  // Fallback: assume local number without leading 0.
  return COUNTRY_CODE + n;
}

export function getWhatsAppNumber(): string | null {
  return normalizeNumber(import.meta.env.VITE_WHATSAPP_NUMBER);
}

export interface WhatsAppServiceItem {
  name: string;
  category?: string;
  durationMinutes?: number;
  price?: number;
}

export interface WhatsAppBookingMessage {
  services: WhatsAppServiceItem[];
  totalPrice: number;
  totalDurationMinutes: number;
  dateLabel: string;
  time: string;
  endTime?: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  specialRequests?: string;
}

export function buildBookingMessage(m: WhatsAppBookingMessage): string {
  const lines: string[] = [
    "Bonjour, je souhaite réserver un rendez-vous :",
    "",
    `Services (${m.services.length}) :`,
  ];
  m.services.forEach((s, i) => {
    let line = `${i + 1}. ${s.name}`;
    if (s.category) line += ` (${s.category})`;
    if (s.durationMinutes) line += ` — ${s.durationMinutes} min`;
    if (typeof s.price === "number") line += ` — ${s.price} DH`;
    lines.push(line);
  });
  lines.push("");
  lines.push(`Durée totale : ${m.totalDurationMinutes} min`);
  lines.push(`Total : ${m.totalPrice} DH`);
  lines.push(`Date : ${m.dateLabel}`);
  lines.push(`Heure : ${m.time}` + (m.endTime ? ` (fin ~${m.endTime})` : ""));
  lines.push("");
  lines.push(`Client : ${m.clientFirstName} ${m.clientLastName}`.trim());
  lines.push(`Email : ${m.clientEmail}`);
  lines.push(`Téléphone : ${m.clientPhone}`);
  if (m.specialRequests) lines.push(`Demandes spéciales : ${m.specialRequests}`);
  return lines.join("\n");
}

export function buildWhatsAppBookingUrl(message: string): string | null {
  const number = getWhatsAppNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppBooking(message: string): boolean {
  const url = buildWhatsAppBookingUrl(message);
  if (!url) return false;
  // Prefer opening in a new tab so the SPA stays alive.
  const win = window.open(url, "_blank", "noopener,noreferrer");
  return !!win;
}