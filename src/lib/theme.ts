/**
 * Global Theme Configuration
 * 
 * This file defines the color palette for the entire application.
 * To change the theme, simply update the color values below.
 * 
 * The CSS variables in globals.css will automatically use these values.
 */

export const theme = {
  // Base color palette
  colors: {
    // Beige Theme (Current)
    beige: {
      50: '#fdfcfb',
      100: '#f5f0eb',  // Card backgrounds
      200: '#f0e6d8',  // Muted/secondary elements
      300: '#e6d5c7',  // Borders and inputs
      400: '#d4c4b0',
      500: '#ecdcd0',  // Main background
      600: '#c4a882',
      700: '#a68b6b',  // Dark mode secondary
      800: '#8b7355',  // Dark mode cards
      900: '#6b5a47',  // Dark mode background
    },
    
    // Alternative themes (for future use)
    blue: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',  // Main background
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',  // Main background
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
  },
  
  // Current active theme
  activeTheme: 'beige',
  
  // Semantic color mappings
  semantic: {
    background: 'beige.500',
    card: 'beige.100',
    secondary: 'beige.200',
    muted: 'beige.200',
    accent: 'beige.200',
    border: 'beige.300',
    input: 'beige.300',
  },
  
  // Dark mode mappings
  dark: {
    background: 'beige.900',
    card: 'beige.800',
    secondary: 'beige.700',
    muted: 'beige.700',
    accent: 'beige.700',
    border: 'beige.600',
    input: 'beige.600',
  },
} as const;

/**
 * Get the current theme colors
 */
export function getCurrentTheme() {
  return theme.colors[theme.activeTheme as keyof typeof theme.colors];
}

/**
 * Generate CSS custom properties for a theme
 */
export function generateThemeCSS(themeName: keyof typeof theme.colors) {
  const colors = theme.colors[themeName];
  const cssVars: Record<string, string> = {};
  
  Object.entries(colors).forEach(([key, value]) => {
    cssVars[`--${themeName}-${key}`] = value;
  });
  
  return cssVars;
}

/**
 * Apply a new theme (for future theme switching functionality)
 */
export function applyTheme(newTheme: keyof typeof theme.colors) {
  // This would be used for dynamic theme switching
  // For now, themes are applied via CSS variables in globals.css
  console.log(`Switching to ${newTheme} theme`);
  return generateThemeCSS(newTheme);
}
