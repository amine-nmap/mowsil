import QRCode from "qrcode";

export type StickerConfig = {
  bookingId: string;
  agencyName: string;
  vehicleName: string;
  baseUrl?: string;
};

export async function generateStickerUrl(config: StickerConfig): Promise<string> {
  const baseUrl = config.baseUrl ?? process.env.NEXT_PUBLIC_BASE_URL ?? "https://mowsil.vercel.app";

  const url = new URL(`${baseUrl}/reservation/${config.bookingId}`);
  url.searchParams.set("ref", config.agencyName.toLowerCase().replace(/\s+/g, "-"));
  url.searchParams.set("utm_source", "sticker");
  url.searchParams.set("utm_medium", "qr");
  url.searchParams.set("utm_campaign", "booking-sticker");
  url.searchParams.set("utm_content", config.bookingId);

  return QRCode.toDataURL(url.toString(), {
    width: 300,
    margin: 2,
    color: { dark: "#0A2540", light: "#FFFFFF" },
  });
}
