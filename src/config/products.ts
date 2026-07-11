import type { ThemeId } from "../theme/themes";
import type { ProductReleaseConfig } from "../services/releaseFetcher";

export type ProductSlug = "maxclicker" | "maxmacro";

export interface ProductConfig {
  slug: ProductSlug;
  name: string;
  tagline: string;
  description: string;
  theme: ThemeId;
  iconUrl: string;
  release: ProductReleaseConfig;
}

export const products: Record<ProductSlug, ProductConfig> = {
  maxclicker: {
    slug: "maxclicker",
    name: "MaxClicker",
    tagline: "Precision auto-clicking for competitive play.",
    description:
      "MaxClicker is a lightweight Windows tool for fast, reliable automated clicking, built for games and repetitive tasks that demand consistent timing.",
    theme: "maxclicker",
    iconUrl: "/assets/maxclicker/icon.png",
    release: {
      repo: "crossgozon/maxclicker-download",
      assetNameRegex: /^Maxclicker\..+\.zip$/i,
      excludeAssetRegex: /updater/i,
      mirrorCommentTag: "MAXCLICKER_RELEASE_MIRRORS",
      mirrorPathSegment: "maxclicker",
    },
  },
  maxmacro: {
    slug: "maxmacro",
    name: "MaxMacro",
    tagline: "Macro and input-binding workspace for precise automation.",
    description:
      "MaxMacro is a desktop macro and input binding workspace, built for precise timing, repeatable input sequences, and focused practice.",
    theme: "maxmacro",
    iconUrl: "/assets/maxmacro/icon.png",
    release: {
      repo: "crossgozon/maxmacro-download",
      assetNameRegex: /^Maxmacro\..+\.zip$/i,
      excludeAssetRegex: /updater/i,
      mirrorCommentTag: "MAXMACRO_RELEASE_MIRRORS",
      mirrorPathSegment: "maxmacro",
    },
  },
};

export const productList: ProductConfig[] = Object.values(products);
