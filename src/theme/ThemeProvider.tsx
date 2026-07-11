import type { CSSProperties, ElementType, ReactNode } from "react";
import { themes, type ThemeId } from "./themes";

interface ThemeScopeProps {
  theme: ThemeId;
  children: ReactNode;
  as?: ElementType;
  className?: string;
  [key: string]: unknown;
}

/**
 * Applies a product's CSS variable palette to everything rendered inside it.
 * Components read colors via var(--accent) etc. and never need to know which
 * product/theme they're currently inside. Extra props (e.g. `to` when
 * `as={Link}`) are forwarded to the rendered tag/component.
 */
export function ThemeScope({ theme, children, as: Tag = "div", className, ...rest }: ThemeScopeProps) {
  const style = themes[theme] as unknown as CSSProperties;

  return (
    <Tag data-theme={theme} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}
