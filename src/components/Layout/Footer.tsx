import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <img src="/assets/maxie-apps_title_header.png" alt="Maxie Apps" className="site-footer-brand" />
        <div className="site-footer-text">
          <span>Maxie Apps official release channel.</span>
          <span>Verified builds for MaxClicker &amp; MaxMacro.</span>
        </div>
        <span className="site-footer-copy">© {new Date().getFullYear()} Maxie Apps</span>
      </div>
    </footer>
  );
}
