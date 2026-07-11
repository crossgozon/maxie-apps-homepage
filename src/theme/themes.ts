export type ThemeId = "maxclicker" | "maxmacro" | "maxperformance" | "neutral";

export interface ThemeVars {
  "--bg-0": string;
  "--bg-1": string;
  "--bg-2": string;
  "--panel": string;
  "--line": string;
  "--text": string;
  "--muted": string;
  "--accent": string;
  "--accent-2": string;
  "--accent-rgb": string;
  "--accent-2-rgb": string;
  "--success": string;
}

export const themes: Record<ThemeId, ThemeVars> = {
  maxclicker: {
    "--bg-0": "#061121",
    "--bg-1": "#0b1e36",
    "--bg-2": "#113259",
    "--panel": "rgba(8, 23, 43, 0.86)",
    "--line": "rgba(104, 183, 255, 0.18)",
    "--text": "#eef7ff",
    "--muted": "#9ebfe0",
    "--accent": "#21a7e3",
    "--accent-2": "#ffb24a",
    "--accent-rgb": "33, 167, 227",
    "--accent-2-rgb": "255, 178, 74",
    "--success": "#29c46d",
  },
  maxmacro: {
    "--bg-0": "#111111",
    "--bg-1": "#1a1414",
    "--bg-2": "#1f1f1f",
    /* Was rgba(17, 17, 17, 0.9) - the exact same RGB as --bg-0, so every
       gv-shell card blended invisibly into the page. A neutral-gray fix
       (31,31,31) made cards visible but colorless; this deep-wine tone
       (chosen from a side-by-side sample set) gives real contrast and
       reads unmistakably as MaxMacro. */
    "--panel": "rgba(50, 18, 22, 0.95)",
    "--line": "rgba(185, 28, 43, 0.25)",
    "--text": "#f5f7fa",
    "--muted": "#8e9aad",
    "--accent": "#b91c2b",
    "--accent-2": "#ff6a3d",
    "--accent-rgb": "185, 28, 43",
    "--accent-2-rgb": "255, 106, 61",
    "--success": "#20d89a",
  },
  // The background art is already cyan-heavy, so the UI chrome uses graphite
  // and violet/amber accents instead of repeating the same teal everywhere.
  maxperformance: {
    "--bg-0": "#08090f",
    "--bg-1": "#11111a",
    "--bg-2": "#191322",
    "--panel": "rgba(18, 17, 28, 0.94)",
    "--line": "rgba(167, 139, 250, 0.24)",
    "--text": "#f3f5ff",
    "--muted": "#b9bdd2",
    "--accent": "#a78bfa",
    "--accent-2": "#f2b84b",
    "--accent-rgb": "167, 139, 250",
    "--accent-2-rgb": "242, 184, 75",
    "--success": "#45d483",
  },
  // Neutral chrome (nav/footer) sits outside either product identity so it
  // doesn't visually compete with whichever theme a page section is showing.
  neutral: {
    "--bg-0": "#07080b",
    "--bg-1": "#0e1015",
    "--bg-2": "#14171d",
    "--panel": "rgba(14, 16, 21, 0.9)",
    "--line": "rgba(255, 255, 255, 0.08)",
    "--text": "#eef2f7",
    "--muted": "#8f98a8",
    "--accent": "#7c8aa0",
    "--accent-2": "#a8b2c2",
    "--accent-rgb": "124, 138, 160",
    "--accent-2-rgb": "168, 178, 194",
    "--success": "#29c46d",
  },
};
