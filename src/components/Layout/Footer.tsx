import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>© {new Date().getFullYear()} Maxie Apps</span>
        <span>MaxClicker &amp; MaxMacro official downloads and updates</span>
      </div>
    </footer>
  );
}
