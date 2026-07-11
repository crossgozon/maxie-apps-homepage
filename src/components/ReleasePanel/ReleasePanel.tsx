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
  const publishedLabel = release.publishedAt
    ? new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(release.publishedAt))
    : "Not available";

  return (
    <div className="release-panel">
      <div className="release-meta">
        <div>
          <span className="release-meta-label">Version</span>
          <strong>{release.version}</strong>
        </div>
        <div>
          <span className="release-meta-label">Published</span>
          <strong>{publishedLabel}</strong>
        </div>
        <div>
          <span className="release-meta-label">File</span>
          <strong>
            {release.assetName} ({formatBytes(release.assetSizeBytes)})
          </strong>
        </div>
      </div>

      <div className="release-actions">
        <DownloadButton url={release.assetUrl} fileName={release.assetName} variant="primary">
          Download {product.name}
        </DownloadButton>
        {release.mirror && (
          <DownloadButton url={release.mirror.url} fileName={release.assetName} variant="secondary">
            Mirror Download
          </DownloadButton>
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
