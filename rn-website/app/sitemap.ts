import type { MetadataRoute } from "next";

const BASE = "https://robonexus.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/about", "/team", "/alumni", "/projects", "/events", "/contact"];
  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));
}
