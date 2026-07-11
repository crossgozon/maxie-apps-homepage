import type { GithubRelease, ReleaseInfo, ReleaseMirror } from "./releaseTypes";

export interface ProductReleaseConfig {
  /** e.g. "crossgozon/maxclicker-download" */
  repo: string;
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

export class ReleaseFetchError extends Error {
  /** "empty" = no release/asset published yet (expected, not a real failure); "error" = fetch actually failed. */
  code: "empty" | "error";

  constructor(message: string, code: "empty" | "error") {
    super(message);
    this.code = code;
  }
}

export async function fetchLatestRelease(config: ProductReleaseConfig): Promise<ReleaseInfo> {
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
    version: release.tag_name || release.name || "Unavailable",
    publishedAt: release.published_at,
    assetName: packageAsset.name,
    assetSizeBytes: packageAsset.size || 0,
    assetUrl: packageAsset.browser_download_url,
    notes: stripMirrorComment(release.body, config.mirrorCommentTag),
    releasePageUrl: release.html_url,
    mirror: findMirror(release, config),
  };
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
