import type { ThemeId } from "../theme/themes";

export type ProductSlug = "maxclicker" | "maxmacro";

export interface ProductConfig {
  slug: ProductSlug;
  name: string;
  tagline: string;
  description: string;
  theme: ThemeId;
  // Release-fetching fields are added in Phase 3.
}

export const products: Record<ProductSlug, ProductConfig> = {
  maxclicker: {
    slug: "maxclicker",
    name: "MaxClicker",
    tagline: "Precision auto-clicking for competitive play.",
    description:
      "MaxClicker is a lightweight Windows tool for fast, reliable automated clicking, built for games and repetitive tasks that demand consistent timing.",
    theme: "maxclicker",
  },
  maxmacro: {
    slug: "maxmacro",
    name: "MaxMacro",
    tagline: "Macro and input-binding workspace for precise automation.",
    description:
      "MaxMacro is a desktop macro and input binding workspace, built for precise timing, repeatable input sequences, and focused practice.",
    theme: "maxmacro",
  },
};

export const productList: ProductConfig[] = Object.values(products);
