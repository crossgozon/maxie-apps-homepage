import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import "./PageTransition.css";

type TransitionDirection = "right" | "left" | "fade";

function getDirection(pathname: string): TransitionDirection {
  // Matches both the short form (/maxclicker) and the nested form
  // (/downloads/maxclicker) - checking only the exact short path missed
  // the nested route entirely, silently falling back to a plain fade.
  if (/\/maxclicker\/?$/.test(pathname)) return "right";
  if (/\/maxmacro\/?$/.test(pathname)) return "left";
  return "fade";
}

function getSlideClass(direction: TransitionDirection): string {
  if (direction === "right") return "page-slide-right";
  if (direction === "left") return "page-slide-left";
  return "page-slide-fade";
}

export function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const isHome = location.pathname === "/";
  const direction = getDirection(location.pathname);
  const isProductPage = direction !== "fade";
  const variants: Variants = {
    enter: {
      opacity: isProductPage ? 1 : 0,
      x: 0,
    },
    center: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: isProductPage ? 1 : 0,
      x: 0,
    },
  };

  return (
    <div
      // Footer.css keys off "page-transition-home" to zero out its top
      // margin on the Home page (whose split-hero already fills the
      // viewport) - Footer is a sibling of this wrapper, not of
      // .home-page directly, so it can't select on .home-page itself.
      className={`page-transition-stage ${getSlideClass(direction)}${isHome ? " page-transition-home" : ""}`}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={location.pathname}
          className="page-transition"
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: isProductPage ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
