import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <img src="/assets/maxie-apps_title_header.png" alt="Maxie Apps" className="site-footer-brand" />
        <span className="site-footer-text">Official release channel for MaxClicker &amp; MaxMacro</span>
        <span className="site-footer-copy">© {new Date().getFullYear()} Maxie Apps</span>
      </div>
    </footer>
  );
}
