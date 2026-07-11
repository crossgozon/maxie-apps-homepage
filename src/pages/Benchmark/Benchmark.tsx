import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStopwatch,
  faChartColumn,
  faFileExport,
  faChartLine,
  faMagnifyingGlassPlus,
} from "@fortawesome/free-solid-svg-icons";
import { ThemeScope } from "../../theme/ThemeProvider";
import { Lightbox, type LightboxImage } from "../../components/Lightbox/Lightbox";
import "../../components/common/Button.css";
import "./Benchmark.css";

const highlights = [
  {
    title: "Universal input capture",
    description: "Captures real keyboard and mouse input timing during a run, so you can benchmark any macro or automation tool - not just MaxMacro.",
    icon: faStopwatch,
    images: [{ src: "/assets/maxperformance/Dashboard.png", caption: "Dashboard" }],
  },
  {
    title: "Session comparison",
    description: "Compare multiple saved runs side by side - summary metrics and a row-by-row input sequence match/diff view.",
    icon: faChartColumn,
    images: [
      { src: "/assets/maxperformance/comparison summary matrics.png", caption: "Summary Metrics" },
      { src: "/assets/maxperformance/input sequence results compare and match.png", caption: "Input Sequence Compare" },
    ],
  },
  {
    title: "Stability & warm-up scoring",
    description: "Scores each run for stability and warm-up accuracy, with score and trend charts instead of just a raw average.",
    icon: faChartLine,
    images: [{ src: "/assets/maxperformance/chart benchmark results with imports.png", caption: "Score Charts" }],
  },
  {
    title: "Import & export",
    description: "Import saved runs and export comparison charts or reports to Excel, CSV, or image for sharing and record-keeping.",
    icon: faFileExport,
    images: [{ src: "/assets/maxperformance/run history.png", caption: "Run History" }],
  },
];

export function Benchmark() {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  return (
    <ThemeScope theme="maxperformance" as="main" className="benchmark-page">
      <div className="benchmark-hero gv-fade-up">
        <img src="/assets/maxperformance/header_title.png" alt="MAXPERFORMANCE" className="benchmark-wordmark" />
        <p className="benchmark-description">
          MAXPERFORMANCE captures real keyboard and mouse input timing, scores stability and warm-up
          accuracy, and compares runs side by side - so you know exactly how your macro setup performs,
          instead of guessing.
        </p>
      </div>

      <section className="benchmark-highlights">
        {highlights.map((item, index) => (
          <div key={item.title} className="benchmark-card gv-shell gv-fade-up" style={{ animationDelay: `${0.05 * index}s` }}>
            <div className="benchmark-card-icon">
              <FontAwesomeIcon icon={item.icon} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="benchmark-card-images">
              {item.images.map((image) => (
                <button
                  key={image.src}
                  type="button"
                  className="benchmark-card-image"
                  onClick={() => setLightboxImage(image)}
                >
                  <img src={image.src} alt={image.caption} loading="lazy" />
                  <span className="benchmark-card-image-zoom" aria-hidden="true">
                    <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
                  </span>
                  <span className="benchmark-card-image-caption">{image.caption}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* MaxMacro's own crimson theme on purpose, not the page's blue -
          a visual cue that this button leads over to MaxMacro's page. */}
      <ThemeScope theme="maxmacro" as="section" className="benchmark-cta gv-fade-up">
        <img src="/assets/maxmacro/icon.png" alt="" width={40} height={40} className="benchmark-cta-icon" />
        <p>MAXPERFORMANCE ships as a companion tool alongside MaxMacro.</p>
        <Link to="/maxmacro" className="btn btn-primary">
          Get MaxMacro →
        </Link>
      </ThemeScope>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </ThemeScope>
  );
}
