import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch, faCalendarDays, faFileZipper } from "@fortawesome/free-solid-svg-icons";
import { useLatestRelease } from "../../hooks/useLatestRelease";
import { formatBytes } from "../../services/formatBytes";
import type { ProductConfig } from "../../config/products";
import { DownloadButton } from "./DownloadButton";
import "../common/Button.css";
import "./ReleasePanel.css";

interface ReleasePanelProps {
  product: ProductConfig;
  showNotes?: boolean;
}

export function ReleasePanel({ product, showNotes = false }: ReleasePanelProps) {
  const state = useLatestRelease(product.release);

  if (state.status === "loading") {
    return (
      <div className="release-panel release-panel-loading" aria-live="polite">
        <div className="release-skeleton-line" style={{ width: "40%" }} />
        <div className="release-skeleton-line" style={{ width: "70%" }} />
        <div className="release-skeleton-line release-skeleton-button" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="release-panel release-panel-error" role="alert">
        <p>Could not read the latest release right now. Check back later or view it directly on GitHub.</p>
        <a
          className="btn btn-secondary"
          href={`https://github.com/${product.release.repo}/releases/latest`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </div>
    );
  }

  if (state.status === "empty") {
    return (
      <div className="release-panel release-panel-empty">
        <p>No {product.name} release has been published yet. Check back soon.</p>
        <a
          className="btn btn-secondary"
          href={`https://github.com/${product.release.repo}/releases`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View releases on GitHub
        </a>
      </div>
    );
  }

  const release = state.data!;
  // The remote-config fallback path (used to dodge GitHub API rate limits)
  // doesn't carry file size or publish date at all - showing "Not
  // available"/"Size unavailable" placeholders there reads like something's
  // broken, so those chips are simply omitted instead when the data isn't
  // there, rather than displayed as an error-looking placeholder.
  const publishedLabel = release.publishedAt
    ? new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(release.publishedAt))
    : null;
  const sizeLabel = release.assetSizeBytes ? formatBytes(release.assetSizeBytes) : null;

  return (
    <div className="release-panel">
      <div className="release-stats">
        <span className="release-stat">
          <FontAwesomeIcon icon={faCodeBranch} />v{release.version}
        </span>
        {publishedLabel && (
          <span className="release-stat">
            <FontAwesomeIcon icon={faCalendarDays} />
            {publishedLabel}
          </span>
        )}
        {sizeLabel && (
          <span className="release-stat">
            <FontAwesomeIcon icon={faFileZipper} />
            {sizeLabel}
          </span>
        )}
      </div>

      <div className="release-actions">
        <DownloadButton url={release.assetUrl} fileName={release.assetName} label={`Download ${product.name}`} kind="github" />
        {release.mirror && (
          <DownloadButton url={release.mirror.url} fileName={release.assetName} label="Mirror Download" kind="mirror" />
        )}
      </div>

      {showNotes && release.notes && (
        <details className="release-notes">
          <summary>Release notes</summary>
          <pre>{release.notes}</pre>
        </details>
      )}
    </div>
  );
}
