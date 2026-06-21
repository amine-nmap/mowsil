export const siteConfig = {
  name: "MOWSIL",
  nameAr: "موصل",
  description: "Premier agrégateur de location de voitures de confiance à Oujda",
  url: "https://mowsil.vercel.app",
  locales: ["fr", "ar"] as const,
  defaultLocale: "fr" as const,
};

export type Locale = (typeof siteConfig.locales)[number];
