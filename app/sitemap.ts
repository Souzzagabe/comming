import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/politica-de-cookies` },
  ];
}
