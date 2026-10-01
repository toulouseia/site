import type { MetadataRoute } from "next";
import { listerProjets } from "@/donnees/api";

/** L'adresse publique. Le plan du site est produit une fois, à la fabrication. */
const SITE = "https://toulouseia.fr";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projets = await listerProjets();
  const pages = ["", "/projets", "/apprendre", "/veille", "/outils", "/deposer"];
  return [
    ...pages.map((p) => ({ url: `${SITE}${p}/` })),
    ...projets.map((p) => ({
      url: `${SITE}/projets/${p.slug}/`,
      lastModified: p.maj,
    })),
  ];
}
