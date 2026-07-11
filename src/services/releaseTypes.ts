export interface GithubReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

export interface GithubRelease {
  tag_name: string;
  name: string;
  published_at: string | null;
  body: string | null;
  html_url: string;
  assets: GithubReleaseAsset[];
}

export interface ReleaseMirror {
  name: string;
  url: string;
  zipSha256?: string;
}

export interface ReleaseInfo {
  version: string;
  publishedAt: string | null;
  assetName: string;
  assetSizeBytes: number | null;
  assetUrl: string;
  notes: string | null;
  releasePageUrl: string;
  mirror?: ReleaseMirror;
}

export type ReleaseStatus = "loading" | "success" | "error" | "empty";

export interface ReleaseState {
  status: ReleaseStatus;
  data?: ReleaseInfo;
  error?: string;
}
