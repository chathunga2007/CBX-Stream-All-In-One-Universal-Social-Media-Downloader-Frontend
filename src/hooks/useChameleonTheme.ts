import { useState, useEffect, useCallback } from 'react';
import { PlatformTheme } from '../types/media';
import { PLATFORM_THEMES } from '../config/platforms';

/**
 * Dynamically synchronizes CSS custom properties with Chameleon Glass UI theme tokens
 */
export function useChameleonTheme(initialTheme?: PlatformTheme) {
  const [currentTheme, setCurrentTheme] = useState<PlatformTheme>(
    initialTheme || PLATFORM_THEMES.generic
  );

  const applyThemeVariables = useCallback((theme: PlatformTheme) => {
    const root = document.documentElement;

    root.style.setProperty('--cbx-primary', theme.primary_color);
    root.style.setProperty('--cbx-secondary', theme.secondary_color);
    root.style.setProperty('--cbx-accent', theme.accent_color);
    root.style.setProperty('--cbx-glow', theme.glow_color);
    root.style.setProperty('--cbx-gradient', theme.gradient_css);
    root.style.setProperty(
      '--cbx-border',
      theme.glass_border.replace(/^1px solid\s*/, '')
    );
  }, []);

  const updateTheme = useCallback((theme: PlatformTheme) => {
    setCurrentTheme(theme);
    applyThemeVariables(theme);
  }, [applyThemeVariables]);

  const resetTheme = useCallback(() => {
    setCurrentTheme(PLATFORM_THEMES.generic);
    applyThemeVariables(PLATFORM_THEMES.generic);
  }, [applyThemeVariables]);

  useEffect(() => {
    if (initialTheme) {
      applyThemeVariables(initialTheme);
    }
  }, [initialTheme, applyThemeVariables]);

  return {
    currentTheme,
    updateTheme,
    resetTheme,
  };
}
