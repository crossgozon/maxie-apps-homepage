import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faKeyboard,
  faBolt,
  faWindowRestore,
  faGamepad,
  faCommentSlash,
  faSliders,
  faDesktop,
  faChartLine,
  faDog,
  faDiagramProject,
  faLayerGroup,
  faDumbbell,
  faUserGear,
  faComputerMouse,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import type { ThemeId } from "../theme/themes";
import type { ProductReleaseConfig } from "../services/releaseFetcher";

// "owner/repo" per product, overridable via .env (VITE_*_REPO) - single
// source of truth for both release fetching and the legal doc raw URLs
// below, instead of the repo name being hardcoded in multiple places.
const MAXCLICKER_REPO = import.meta.env.VITE_MAXCLICKER_REPO || "crossgozon/maxclicker-download";
const MAXMACRO_REPO = import.meta.env.VITE_MAXMACRO_REPO || "crossgozon/maxmacro-download";
const MAXCLICKER_REMOTE_CONFIG_URL =
  import.meta.env.VITE_MAXCLICKER_REMOTE_CONFIG_URL ||
  "https://api.maxie-apps.online/api/remote-config";
const MAXMACRO_REMOTE_CONFIG_URL =
  import.meta.env.VITE_MAXMACRO_REMOTE_CONFIG_URL ||
  "https://api.maxmacro.maxie-apps.online/api/remote-config";

function rawGithubUrl(repo: string, path: string) {
  return `https://raw.githubusercontent.com/${repo}/main/${path}`;
}

export type ProductSlug = "maxclicker" | "maxmacro";

export interface ProductFeature {
  title: string;
  description: string;
  icon: IconDefinition;
  images?: { src: string; caption: string }[];
}

export interface ProductConfig {
  slug: ProductSlug;
  name: string;
  tagline: string;
  description: string;
  /** Punchier one-liner for the Home page split hero - description stays
      factual for About/Downloads, this is the gaming-vibe hook. */
  heroHook: string;
  theme: ThemeId;
  iconUrl: string;
  wordmarkUrl?: string;
  screenshotUrl?: string;
  features: ProductFeature[];
  systemRequirements?: { label: string; value: string }[];
  /** Raw GitHub text file URLs - only present once a product has actually
      published these; MaxClicker doesn't have a legal/ folder yet. */
  legalDocs?: { label: string; url: string }[];
  release: ProductReleaseConfig;
}

export const products: Record<ProductSlug, ProductConfig> = {
  maxclicker: {
    slug: "maxclicker",
    name: "MaxClicker",
    tagline: "Official Build",
    description:
      "Maxclicker is a lightweight Auto Potion and Macro Simulator built for MU Online and other MMORPGs where automation is supported.",
    heroHook:
      "Automated key sequences and instant global hotkeys, engineered for MU Online and beyond.",
    theme: "maxclicker",
    iconUrl: "/assets/maxclicker/icon.png",
    wordmarkUrl: "/assets/maxclicker/header_title.png",
    screenshotUrl: "/assets/maxclicker/screenshots/normal.png",
    features: [
      {
        title: "Normal & Compact window modes",
        description: "Switch between the full Normal window and a reduced-size Compact window for a cleaner desktop, without losing access to core controls.",
        icon: faWindowRestore,
        images: [
          { src: "/assets/maxclicker/screenshots/normal.png", caption: "Normal Window" },
          { src: "/assets/maxclicker/screenshots/compact.png", caption: "Compact Window" },
        ],
      },
      {
        title: "Key-sequence automation",
        description: "Cycles through a configurable key sequence repeatedly while running, with independent interval and hold-time controls for precise timing.",
        icon: faKeyboard,
      },
      {
        title: "Global start/stop hotkey",
        description: "Bind any keyboard key or mouse button as a global hotkey to start, stop, and pause automation instantly, even while the game window is focused.",
        icon: faBolt,
      },
      {
        title: "Foreground game gate",
        description: "Automation automatically pauses when the supported game window loses focus, and resumes the moment it's active again - no accidental input elsewhere.",
        icon: faGamepad,
      },
      {
        title: "Chat guard",
        description: "Pressing Enter suspends key output while you type in-game chat, and automatically resumes once chat closes or you press Escape.",
        icon: faCommentSlash,
      },
      {
        title: "Standard & Legacy input modes",
        description: "Choose how sequence keys are sent to the game, for compatibility across different titles and anti-cheat setups.",
        icon: faSliders,
      },
      {
        title: "Tray integration & startup options",
        description: "Launch at Windows startup, start minimized to tray, and choose whether minimize/close send the app to the tray instead of closing it.",
        icon: faDesktop,
      },
      {
        title: "Run diagnostics",
        description: "Every run saves a local diagnostic log - mode, target, run time, sent presses, average/worst loop delay, and stability - so support can help troubleshoot quickly if something looks off.",
        icon: faChartLine,
      },
    ],
    systemRequirements: [
      { label: "OS", value: "Windows 10/11 (64-bit)" },
      { label: "Processor", value: "Dual-core 2.0 GHz+" },
      { label: "RAM", value: "4 GB" },
      { label: "Storage", value: "200 MB free" },
      { label: "Display", value: "1024 x 768 or higher" },
      { label: "Access", value: "Administrator" },
      { label: "Internet", value: "Updates only" },
    ],
    release: {
      repo: MAXCLICKER_REPO,
      remoteConfigUrls: [MAXCLICKER_REMOTE_CONFIG_URL],
      assetNameRegex: /^Maxclicker\..+\.zip$/i,
      excludeAssetRegex: /updater/i,
      mirrorCommentTag: "MAXCLICKER_RELEASE_MIRRORS",
      mirrorUrlPattern: /^https:\/\/backblaze\.maxie-apps\.online\/maxclicker\/Release\/[^/]+\/[^/]+\.zip$/i,
    },
  },
  maxmacro: {
    slug: "maxmacro",
    name: "MaxMacro",
    tagline: "Official Build",
    description:
      "MaxMacro is a desktop macro and input binding workspace, built for precise timing, repeatable input sequences, and focused practice.",
    heroHook:
      "Dual timing engines, visual macro editing, and millisecond-precise execution - engineered for total control.",
    theme: "maxmacro",
    iconUrl: "/assets/maxmacro/icon.png",
    wordmarkUrl: "/assets/maxmacro/header_title.png",
    /* Ordered to match the real app's own navigation flow (Profiles ->
       Macros -> Binds), not an arbitrary/historical order - each group
       below corresponds to one tab in the actual MaxMacro nav bar. */
    features: [
      // Profiles
      {
        title: "Profile Library",
        description: "Each profile stores its own macros, bindings, and runtime engine choice, so switching profiles switches your whole setup instantly.",
        icon: faUserGear,
        images: [{ src: "/assets/maxmacro/features/PROFILE LIBRARY.png", caption: "Profile Library" }],
      },
      {
        title: "Per-game scope",
        description: "Link specific game executables to a profile so its macro hotkeys only activate inside the games you choose, instead of firing everywhere.",
        icon: faListCheck,
        images: [{ src: "/assets/maxmacro/features/MY GAMES.png", caption: "My Games" }],
      },
      // Macros
      {
        title: "Visual macro editor",
        description: "Build and edit macro action sequences visually, including nested repeat blocks, without hand-writing scripts.",
        icon: faDiagramProject,
        images: [{ src: "/assets/maxmacro/features/MACRO EDITOR.png", caption: "Macro Editor" }],
      },
      {
        title: "Virtual input hub",
        description: "Drag actions straight into the macro editor from an on-screen Keyboard, Mouse, and Controls (delay/repeat) palette, then manage bound hotkeys with their own playback mode - all without leaving the editor.",
        icon: faKeyboard,
        images: [
          { src: "/assets/maxmacro/features/inputhub_keyboard.png", caption: "Input Hub - Keyboard" },
          { src: "/assets/maxmacro/features/inputhub_mouse.png", caption: "Input Hub - Mouse" },
          { src: "/assets/maxmacro/features/inputhub_controls.png", caption: "Input Hub - Controls" },
          { src: "/assets/maxmacro/features/inputhub_hotkeys.png", caption: "Hotkeys" },
        ],
      },
      {
        title: "Wolf & Hawk timing engines",
        description: "Switch between two independent macro timing schedulers per profile - Wolf, the proven cumulative-deadline design, or Hawk, a warm-up-aware variant - with no rebuild or restart required.",
        icon: faDog,
        images: [
          { src: "/assets/maxmacro/engines/wolf.png", caption: "Wolf Engine" },
          { src: "/assets/maxmacro/engines/hawk.png", caption: "Hawk Engine" },
        ],
      },
      {
        title: "Practice Hub",
        description: "A dedicated practice window for testing and refining macro timing and input sequences before relying on them.",
        icon: faDumbbell,
        images: [
          { src: "/assets/maxmacro/practice_mode_header.png", caption: "Practice Hub" },
          { src: "/assets/maxmacro/features/PRACTICE HUB.png", caption: "Practice Mode" },
        ],
      },
      // Binds
      {
        title: "Full keyboard mapping",
        description: "A visual, full-size keyboard layout for binding actions to physical keys, so you can see your whole layout at a glance. It covers the standard keys every keyboard has - letters, numbers, function keys, modifiers, and more. Special extra keys that only exist on certain keyboard brands aren't covered.",
        icon: faLayerGroup,
        images: [{ src: "/assets/maxmacro/features/KEYBOARD BINDING.png", caption: "Keyboard Binding" }],
      },
      {
        title: "Universal mouse binding",
        description: "Map macros straight to your mouse, no proprietary hardware required. MaxMacro works with any mouse - as long as it has forward/back side buttons, a right-click, and a scroll-wheel click, every one of those inputs can be bound and macroed.",
        icon: faComputerMouse,
        images: [{ src: "/assets/maxmacro/features/MOUSE BINDING.png", caption: "Mouse Binding" }],
      },
    ],
    systemRequirements: [
      { label: "OS", value: "Windows 10/11 (64-bit)" },
      { label: "Processor", value: "Dual-core 2.4 GHz+" },
      { label: "RAM", value: "4 GB" },
      { label: "Storage", value: "250 MB free" },
      { label: "Display", value: "1280 x 720 (fixed window size)" },
      { label: "Access", value: "Administrator" },
      { label: "Internet", value: "Updates only" },
    ],
    legalDocs: [
      { label: "EULA", url: rawGithubUrl(MAXMACRO_REPO, "legal/eula.txt") },
      { label: "Privacy Policy", url: rawGithubUrl(MAXMACRO_REPO, "legal/privacy.txt") },
      { label: "Terms of Use", url: rawGithubUrl(MAXMACRO_REPO, "legal/terms.txt") },
      { label: "Third-Party Notices", url: rawGithubUrl(MAXMACRO_REPO, "legal/third-party-notices.txt") },
    ],
    release: {
      repo: MAXMACRO_REPO,
      remoteConfigUrls: [MAXMACRO_REMOTE_CONFIG_URL],
      assetNameRegex: /^Maxmacro\..+\.zip$/i,
      excludeAssetRegex: /updater/i,
      mirrorCommentTag: "MAXMACRO_RELEASE_MIRRORS",
      mirrorUrlPattern: /^https:\/\/backblaze\.maxmacro\.maxie-apps\.online\/maxmacro\/Release\/[^/]+\/[^/]+\.zip$/i,
    },
  },
};

export const productList: ProductConfig[] = Object.values(products);
