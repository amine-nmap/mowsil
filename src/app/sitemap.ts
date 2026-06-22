import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const BASE_URL = siteConfig.url;

type RouteDef = {
  path: string;
  priority?: number;
  changeFrequency?: "weekly" | "monthly" | "daily" | "yearly";
  keywords?: string[];
};

const staticRoutes: RouteDef[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly", keywords: ["location voiture oujda", "car rental oujda", "agence location oujda"] },
  { path: "/results", priority: 0.9, changeFrequency: "daily", keywords: ["voiture disponible oujda", "location voiture pas cher oujda"] },
  { path: "/dashboard", priority: 0.6, changeFrequency: "monthly" },
  { path: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cgu", priority: 0.3, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
  { path: "/register", priority: 0.5, changeFrequency: "monthly" },
  { path: "/agence/login", priority: 0.4, changeFrequency: "monthly" },
  { path: "/agence/dashboard", priority: 0.3, changeFrequency: "monthly" },
  { path: "/agence/vehicles", priority: 0.4, changeFrequency: "monthly" },
  { path: "/agence/requests", priority: 0.4, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path === "" ? "" : route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency ?? "monthly",
    priority: route.priority ?? 0.5,
    alternates: {
      languages: {
        fr: `${BASE_URL}${route.path}`,
        ar: `${BASE_URL}/ar${route.path}`,
        en: `${BASE_URL}/en${route.path}`,
      },
    },
  }));
}
