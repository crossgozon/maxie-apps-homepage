export type ThemeId = "maxclicker" | "maxmacro" | "neutral";

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
    "--success": "#29c46d",
  },
  maxmacro: {
    "--bg-0": "#111111",
    "--bg-1": "#1a1414",
    "--bg-2": "#1f1f1f",
    "--panel": "rgba(17, 17, 17, 0.9)",
    "--line": "rgba(185, 28, 43, 0.25)",
    "--text": "#f5f7fa",
    "--muted": "#8e9aad",
    "--accent": "#b91c2b",
    "--accent-2": "#2b0a10",
    "--success": "#20d89a",
  },
  // Neutral chrome (nav/footer) sits outside either product identity so it
  // doesn't visually compete with whichever theme a page section is showing.
  neutral: {
    "--bg-0": "#0a0c10",
    "--bg-1": "#12151b",
    "--bg-2": "#181c24",
    "--panel": "rgba(18, 21, 27, 0.9)",
    "--line": "rgba(255, 255, 255, 0.08)",
    "--text": "#eef2f7",
    "--muted": "#8f98a8",
    "--accent": "#7c8aa0",
    "--accent-2": "#a8b2c2",
    "--success": "#29c46d",
  },
};
