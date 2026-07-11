import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import "./DocModal.css";

export interface DocModalTarget {
  label: string;
  url: string;
  /** Filled into the {{APP_NAME}} placeholder - the rest of the template
      vars come from env (shared across every product's legal docs). */
  appName: string;
}

interface DocModalProps {
  doc: DocModalTarget | null;
  onClose: () => void;
}

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; text: string };

// The .txt files in each product's legal/ folder ship as reusable
// {{PLACEHOLDER}} templates (not filled-in text), so a value only needs to
// change here - not in a commit to a different repo - to update every
// legal doc at once. Falls back to the real live values if the env vars
// aren't set at build time, same pattern as the repo-name vars.
function fillTemplate(text: string, appName: string) {
  const vars: Record<string, string> = {
    APP_NAME: appName,
    DEVELOPER_ALIAS: import.meta.env.VITE_LEGAL_DEVELOPER_ALIAS || "MAXIE",
    WEBSITE: import.meta.env.VITE_LEGAL_WEBSITE || "maxie-apps.online",
    SUPPORT_EMAIL: import.meta.env.VITE_LEGAL_SUPPORT_EMAIL || "support@maxie-apps.online",
    EFFECTIVE_DATE: import.meta.env.VITE_LEGAL_EFFECTIVE_DATE || "07/30/2026",
    DOCUMENT_VERSION: import.meta.env.VITE_LEGAL_DOCUMENT_VERSION || "v1.0.0",
  };

  return text.replace(/{{(\w+)}}/g, (match, key: string) => vars[key] ?? match);
}

export function DocModal({ doc, onClose }: DocModalProps) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    if (!doc) return;

    setState({ status: "loading" });
    let cancelled = false;

    fetch(doc.url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((text) => {
        if (!cancelled) setState({ status: "success", text: fillTemplate(text, doc.appName) });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [doc]);

  useEffect(() => {
    if (!doc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [doc, onClose]);

  if (!doc) return null;

  return (
    <div className="docmodal-backdrop" onClick={onClose}>
      <div className="docmodal-panel" onClick={(event) => event.stopPropagation()}>
        <header className="docmodal-header">
          <h2>{doc.label}</h2>
          <div className="docmodal-header-actions">
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="docmodal-raw-link">
              Raw file <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
            <button type="button" className="docmodal-close" aria-label="Close" onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </header>

        <div className="docmodal-body">
          {state.status === "loading" && (
            <div className="docmodal-skeleton">
              <div className="docmodal-skeleton-line" style={{ width: "80%" }} />
              <div className="docmodal-skeleton-line" style={{ width: "94%" }} />
              <div className="docmodal-skeleton-line" style={{ width: "62%" }} />
              <div className="docmodal-skeleton-line" style={{ width: "88%" }} />
            </div>
          )}
          {state.status === "error" && (
            <p className="docmodal-error">
              Could not load this document right now. Try the raw file link above instead.
            </p>
          )}
          {state.status === "success" && <pre className="docmodal-text">{state.text}</pre>}
        </div>
      </div>
    </div>
  );
}
