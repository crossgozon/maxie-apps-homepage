import { useEffect, useRef, useState, type ReactNode } from "react";
import "../common/Button.css";

interface DownloadButtonProps {
  url: string;
  fileName: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}

/**
 * Preloads the asset as a Blob in the background so clicking triggers an
 * instant local download instead of a network redirect. Falls back to the
 * direct URL (still a real, working download) if the preload fails for any
 * reason - the button is never dead.
 */
export function DownloadButton({ url, fileName, children, variant = "primary" }: DownloadButtonProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [blobFailed, setBlobFailed] = useState(false);
  const revokeRef = useRef<string | null>(null);

  useEffect(() => {
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
  }, [url]);

  return (
    <a
      className={`btn btn-${variant}`}
      href={blobUrl ?? url}
      download={fileName}
      rel="noopener"
      data-blob-ready={blobUrl ? "1" : undefined}
      data-blob-failed={blobFailed ? "1" : undefined}
    >
      {children}
    </a>
  );
}
