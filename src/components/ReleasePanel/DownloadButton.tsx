import { useEffect, useRef, useState } from "react";
import "./DownloadButton.css";

interface DownloadButtonProps {
  url: string;
  fileName?: string;
  label: string;
  kind: "github" | "mirror";
  /**
   * True while the real per-version asset URL is still being resolved from
   * the release API. The button still renders and is clickable right away -
   * `url` is a working fallback link (e.g. the GitHub releases page) - it
   * just isn't the direct file yet, so no blob preload runs and no
   * `download` attribute is set (that would save the fallback page itself
   * instead of navigating to it).
   */
  pending?: boolean;
  disabled?: boolean;
}

/**
 * Preloads the asset as a Blob in the background so clicking triggers an
 * instant local download instead of a network redirect. Falls back to the
 * direct URL (still a real, working download) if the preload fails for any
 * reason - the button is never dead.
 */
/** How long a click made while still pending waits for the real URL before giving up and using the fallback. */
const CLICK_GRACE_MS = 4000;

export function DownloadButton({ url, fileName, label, kind, pending = false, disabled = false }: DownloadButtonProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [blobFailed, setBlobFailed] = useState(false);
  const [awaiting, setAwaiting] = useState(false);
  const revokeRef = useRef<string | null>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  // If the user clicks while `pending` is still true, hold the click instead
  // of letting it fall through to the fallback URL immediately - wait a
  // short grace period for the real per-version URL to arrive and replay the
  // click against it, only falling back if the API genuinely doesn't
  // resolve in time.
  useEffect(() => {
    if (!awaiting || disabled) {
      return;
    }

    if (!pending) {
      setAwaiting(false);
      anchorRef.current?.click();
      return;
    }

    const timer = setTimeout(() => {
      setAwaiting(false);
      window.open(url, "_blank", "noopener,noreferrer");
    }, CLICK_GRACE_MS);

    return () => clearTimeout(timer);
  }, [awaiting, pending, url, disabled]);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (disabled) {
      event.preventDefault();
      return;
    }

    if (!pending || awaiting) {
      return;
    }
    event.preventDefault();
    setAwaiting(true);
  }

  useEffect(() => {
    if (pending || disabled) {
      return;
    }

    let cancelled = false;
    setBlobUrl(null);
    setBlobFailed(false);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to prepare file (${response.status}).`);
        }
        return response.blob();
      })
      .then((blob) => {
        if (cancelled) {
          return;
        }
        const objectUrl = URL.createObjectURL(blob);
        revokeRef.current = objectUrl;
        setBlobUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) {
          setBlobFailed(true);
        }
      });

    return () => {
      cancelled = true;
      if (revokeRef.current) {
        URL.revokeObjectURL(revokeRef.current);
        revokeRef.current = null;
      }
    };
  }, [url, pending, disabled]);

  return (
    <a
      ref={anchorRef}
      className={`dl-button dl-button-${kind}`}
      href={disabled ? undefined : blobUrl ?? url}
      download={pending || disabled ? undefined : fileName}
      rel="noopener"
      onClick={handleClick}
      aria-busy={awaiting || undefined}
      aria-disabled={disabled || undefined}
      data-pending={pending ? "1" : undefined}
      data-disabled={disabled ? "1" : undefined}
      data-awaiting={awaiting ? "1" : undefined}
      data-blob-ready={blobUrl ? "1" : undefined}
      data-blob-failed={blobFailed ? "1" : undefined}
    >
      <span>{awaiting ? "Preparing…" : label}</span>
      {pending && !awaiting && <span className="dl-button-caption">Preparing exact version…</span>}
      {kind === "github" ? (
        <img className="dl-mark dl-mark-github" src="/assets/maxclicker/github_logo_cropped.png" alt="" loading="lazy" decoding="async" />
      ) : (
        <img className="dl-mark dl-mark-backblaze" src="/assets/common/backblaze_logo.svg" alt="" loading="lazy" decoding="async" />
      )}
    </a>
  );
}
