import type { CSSProperties, ElementType, ReactNode } from "react";
import { themes, type ThemeId } from "./themes";

interface ThemeScopeProps {
  theme: ThemeId;
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/**
 * Applies a product's CSS variable palette to everything rendered inside it.
 * Components read colors via var(--accent) etc. and never need to know which
 * product/theme they're currently inside.
 */
export function ThemeScope({ theme, children, as: Tag = "div", className }: ThemeScopeProps) {
  const style = themes[theme] as unknown as CSSProperties;

  return (
    <Tag data-theme={theme} className={className} style={style}>
      {children}
    </Tag>
  );
}
