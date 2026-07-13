import { describe, it, expect, beforeAll, vi } from "vitest";
import {
  buildBookingMessage,
  buildWhatsAppBookingUrl,
  getWhatsAppNumber,
  openWhatsAppBooking,
} from "@/lib/whatsapp";

const TEST_NUMBER = "0728729792";

beforeAll(() => {
  import.meta.env.VITE_WHATSAPP_NUMBER = TEST_NUMBER;
});

describe("whatsapp booking", () => {
  it("normalizes the Moroccan test number to international format", () => {
    expect(getWhatsAppNumber()).toBe("212728729792");
  });

  it("builds a wa.me URL pointing to the test salon number", () => {
    const url = buildWhatsAppBookingUrl("hello");
    expect(url).toBeTruthy();
    expect(url!.startsWith("https://wa.me/212728729792?text=")).toBe(true);
  });

  it("lists every selected service plus totals, date, time and client in the message", () => {
    const message = buildBookingMessage({
      services: [
        { name: "Massage Signature", category: "Massages", durationMinutes: 60, price: 450 },
        { name: "Hammam Traditionnel", category: "Hammams", durationMinutes: 30, price: 150 },
      ],
      totalPrice: 600,
      totalDurationMinutes: 90,
      dateLabel: "lundi 15 juillet 2026",
      time: "10:00",
      endTime: "11:30",
      clientFirstName: "Yasmine",
      clientLastName: "Bennani",
      clientEmail: "yasmine@example.com",
      clientPhone: "0728729792",
      specialRequests: "Huile neutre svp",
    });

    expect(message).toContain("Massage Signature");
    expect(message).toContain("Hammam Traditionnel");
    expect(message).toContain("Durée totale : 90 min");
    expect(message).toContain("Total : 600 DH");
    expect(message).toContain("lundi 15 juillet 2026");
    expect(message).toContain("10:00");
    expect(message).toContain("11:30");
    expect(message).toContain("Yasmine Bennani");
    expect(message).toContain("yasmine@example.com");
    expect(message).toContain("Huile neutre svp");
  });

  it("opens WhatsApp in a new tab", () => {
    const spy = vi.spyOn(window, "open").mockReturnValue({} as Window);
    const ok = openWhatsAppBooking("hello");
    expect(ok).toBe(true);
    expect(spy).toHaveBeenCalledOnce();
    const arg = spy.mock.calls[0][0] as string;
    expect(arg.startsWith("https://wa.me/212728729792?text=")).toBe(true);
    spy.mockRestore();
  });
});