import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlassPlus, faMagnifyingGlassMinus, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import "./Lightbox.css";

export interface LightboxImage {
  src: string;
  caption: string;
}

interface LightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

export function Lightbox({ image, onClose }: LightboxProps) {
  const [zoom, setZoom] = useState(1);

  // Reset zoom every time a new image is opened, not just on mount.
  useEffect(() => {
    setZoom(1);
  }, [image]);

  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "+" || event.key === "=") setZoom((z) => clampZoom(z + ZOOM_STEP));
      if (event.key === "-" || event.key === "_") setZoom((z) => clampZoom(z - ZOOM_STEP));
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [image, onClose]);

  if (!image) return null;

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const direction = event.deltaY < 0 ? 1 : -1;
    setZoom((z) => clampZoom(z + direction * 0.15));
  };

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <button type="button" className="lightbox-close" aria-label="Close" onClick={onClose}>
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <div className="lightbox-zoom-controls" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
          disabled={zoom <= MIN_ZOOM}
        >
          <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
        </button>
        <span className="lightbox-zoom-value">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
          disabled={zoom >= MAX_ZOOM}
        >
          <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
        </button>
        {zoom !== 1 && (
          <button type="button" aria-label="Reset zoom" className="lightbox-zoom-reset" onClick={() => setZoom(1)}>
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
        )}
      </div>

      <div
        className={`lightbox-viewport ${zoom > 1 ? "lightbox-viewport-zoomed" : ""}`}
        onClick={(event) => event.stopPropagation()}
        onWheel={handleWheel}
      >
        <figure className="lightbox-figure">
          <img src={image.src} alt={image.caption} style={{ transform: `scale(${zoom})` }} />
          <figcaption>{image.caption}</figcaption>
        </figure>
      </div>
    </div>
  );
}
