import type { GithubRelease, ReleaseInfo, ReleaseMirror } from "./releaseTypes";

export interface ProductReleaseConfig {
  /** e.g. "crossgozon/maxclicker-download" */
  repo: string;
  /** Public app config JSON URLs. These avoid GitHub API rate limits when present. */
  remoteConfigUrls?: string[];
  /** Matches the release asset that should be offered as the primary download. */
  assetNameRegex: RegExp;
  /** Excludes assets that would otherwise match, e.g. updater packages. */
  excludeAssetRegex?: RegExp;
  /** Hidden HTML-comment tag wrapping the mirror JSON in the release body, e.g. "MAXCLICKER_RELEASE_MIRRORS". */
  mirrorCommentTag: string;
  /**
   * Validates a mirror's url before it's trusted. Each product's Backblaze
   * mirror can live under its own domain shape (e.g. MaxClicker uses
   * backblaze.maxie-apps.online/maxclicker/..., MaxMacro uses
   * backblaze.maxmacro.maxie-apps.online/maxmacro/...) - this is defined per
   * product rather than derived from one shared template.
   */
  mirrorUrlPattern: RegExp;
}

interface RemoteDownloadConfig {
  latestVersion?: unknown;
  downloadPageUrl?: unknown;
  downloadUrl?: unknown;
  publicDownloadMirrors?: unknown;
}

export class ReleaseFetchError extends Error {
  /** "empty" = no release/asset published yet (expected, not a real failure); "error" = fetch actually failed. */
  code: "empty" | "error";

  constructor(message: string, code: "empty" | "error") {
    super(message);
    this.code = code;
  }
}

export async function fetchLatestRelease(config: ProductReleaseConfig): Promise<ReleaseInfo> {
  const remoteRelease = await fetchLatestReleaseFromRemoteConfig(config);
  if (remoteRelease) {
    return remoteRelease;
  }

  return fetchLatestReleaseFromGithub(config);
}

async function fetchLatestReleaseFromRemoteConfig(config: ProductReleaseConfig): Promise<ReleaseInfo | null> {
  const urls = config.remoteConfigUrls?.map((url) => url.trim()).filter(Boolean) ?? [];
  if (!urls.length) {
    return null;
  }

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        continue;
      }

      const remoteConfig = (await response.json()) as RemoteDownloadConfig;
      const release = parseRemoteDownloadConfig(remoteConfig, config);
      if (release) {
        return release;
      }
    } catch {
      // Try the next configured source, then fall back to the GitHub API.
    }
  }

  return null;
}

async function fetchLatestReleaseFromGithub(config: ProductReleaseConfig): Promise<ReleaseInfo> {
  const apiUrl = `https://api.github.com/repos/${config.repo}/releases/latest`;

  const response = await fetch(apiUrl, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (response.status === 404) {
    // GitHub returns 404 for "releases/latest" when the repo has no releases yet.
    throw new ReleaseFetchError("No release has been published yet.", "empty");
  }

  if (!response.ok) {
    throw new ReleaseFetchError(`GitHub API returned ${response.status}`, "error");
  }

  const release: GithubRelease = await response.json();
  const assets = Array.isArray(release.assets) ? release.assets : [];
  const packageAsset = assets.find((asset) => {
    const name = String(asset.name || "");
    const matches = config.assetNameRegex.test(name);
    const excluded = config.excludeAssetRegex ? config.excludeAssetRegex.test(name) : false;
    return matches && !excluded;
  });

  if (!packageAsset || !packageAsset.browser_download_url) {
    throw new ReleaseFetchError("No package asset was found on the latest release.", "empty");
  }

  return {
    // GitHub tag names are conventionally already "v"-prefixed (e.g.
    // "v1.0.1") - stripping it here means the "v" added in the UI is
    // always exactly one, instead of "vv1.0.1" when the tag has it and
    // the display also adds one.
    version: (release.tag_name || release.name || "Unavailable").replace(/^v/i, ""),
    publishedAt: release.published_at,
    assetName: packageAsset.name,
    assetSizeBytes: packageAsset.size || 0,
    assetUrl: packageAsset.browser_download_url,
    notes: stripMirrorComment(release.body, config.mirrorCommentTag),
    releasePageUrl: release.html_url,
    mirror: findMirror(release, config),
  };
}

function parseRemoteDownloadConfig(remoteConfig: RemoteDownloadConfig, config: ProductReleaseConfig): ReleaseInfo | null {
  const version = String(remoteConfig.latestVersion || "").trim().replace(/^v/i, "");
  const assetUrl = String(remoteConfig.downloadUrl || "").trim();
  const assetName = getFileNameFromUrl(assetUrl);

  if (!version || !assetUrl || !assetName) {
    return null;
  }

  const excluded = config.excludeAssetRegex ? config.excludeAssetRegex.test(assetName) : false;
  if (!config.assetNameRegex.test(assetName) || excluded) {
    return null;
  }

  return {
    version,
    publishedAt: null,
    assetName,
    assetSizeBytes: null,
    assetUrl,
    notes: null,
    releasePageUrl: String(remoteConfig.downloadPageUrl || "").trim() || `https://github.com/${config.repo}/releases/latest`,
    mirror: findRemoteMirror(remoteConfig, config),
  };
}

function getFileNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").filter(Boolean).pop() || "");
  } catch {
    return "";
  }
}

function findRemoteMirror(remoteConfig: RemoteDownloadConfig, config: ProductReleaseConfig): ReleaseMirror | undefined {
  const mirrors = Array.isArray(remoteConfig.publicDownloadMirrors) ? remoteConfig.publicDownloadMirrors : [];
  const validMirrors = mirrors
    .map((mirror) => {
      const candidate = mirror as Partial<ReleaseMirror>;
      const name = String(candidate?.name || "").trim();
      const url = String(candidate?.url || "").trim();
      const zipSha256 = String(candidate?.zipSha256 || "").trim();

      if (!url || !config.mirrorUrlPattern.test(url)) {
        return null;
      }

      if (zipSha256 && !/^[a-f0-9]{64}$/i.test(zipSha256)) {
        return null;
      }

      return {
        name: name || "Mirror",
        url,
        ...(zipSha256 ? { zipSha256 } : {}),
      };
    })
    .filter((mirror): mirror is ReleaseMirror => Boolean(mirror));

  return validMirrors.find((mirror) => /backblaze/i.test(mirror.name)) ?? validMirrors[0];
}

/** Removes the hidden mirror-JSON comment so it never leaks into displayed release notes. */
function stripMirrorComment(body: string | null, tag: string): string | null {
  if (!body) {
    return body;
  }

  const pattern = new RegExp(`<!--\\s*${tag}\\s*[\\s\\S]*?\\s*${tag}\\s*-->`, "i");
  const stripped = body.replace(pattern, "").trim();
  return stripped || null;
}

function parseReleaseMirrors(release: GithubRelease, config: ProductReleaseConfig): ReleaseMirror[] {
  const body = String(release.body || "");
  const tag = config.mirrorCommentTag;
  const pattern = new RegExp(`<!--\\s*${tag}\\s*([\\s\\S]*?)\\s*${tag}\\s*-->`, "i");
  const match = pattern.exec(body);

  if (!match) {
    return [];
  }

  try {
    const parsed = JSON.parse(match[1]);
    const mirrors: ReleaseMirror[] = Array.isArray(parsed.mirrors) ? parsed.mirrors : [];

    return mirrors.filter((mirror) => {
      const url = String(mirror?.url || "").trim();
      if (!url || !config.mirrorUrlPattern.test(url)) {
        return false;
      }

      const hash = String(mirror?.zipSha256 || "").trim();
      return !hash || /^[a-f0-9]{64}$/i.test(hash);
    });
  } catch {
    return [];
  }
}

function findMirror(release: GithubRelease, config: ProductReleaseConfig): ReleaseMirror | undefined {
  const mirrors = parseReleaseMirrors(release, config);
  return mirrors.find((mirror) => /backblaze/i.test(String(mirror.name || ""))) ?? mirrors[0];
}
