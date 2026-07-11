import { useEffect, useRef, useState } from "react";
import "./DownloadButton.css";

interface DownloadButtonProps {
  url: string;
  fileName: string;
  label: string;
  kind: "github" | "mirror";
}

/**
 * Preloads the asset as a Blob in the background so clicking triggers an
 * instant local download instead of a network redirect. Falls back to the
 * direct URL (still a real, working download) if the preload fails for any
 * reason - the button is never dead.
 */
export function DownloadButton({ url, fileName, label, kind }: DownloadButtonProps) {
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
      className={`dl-button dl-button-${kind}`}
      href={blobUrl ?? url}
      download={fileName}
      rel="noopener"
      data-blob-ready={blobUrl ? "1" : undefined}
      data-blob-failed={blobFailed ? "1" : undefined}
    >
      <span>{label}</span>
      {kind === "github" ? (
        <img className="dl-mark dl-mark-github" src="/assets/maxclicker/github_logo_cropped.png" alt="" loading="lazy" decoding="async" />
      ) : (
        <img
          className="dl-mark dl-mark-backblaze"
          src="https://secure.backblaze.com/bzapp_web_assets/public/scripts/3b562092dff3aa9cd10215e0d762f6e3.svg"
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </a>
  );
}
