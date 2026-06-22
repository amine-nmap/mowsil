import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/test-supabase", "/agence/dashboard", "/agence/vehicles", "/agence/requests", "/dashboard"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
