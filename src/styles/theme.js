// Central theme configuration for Astrawear
// All design tokens: colors, spacing, fonts, radii, shadows
// Used throughout the app via styled-components ThemeProvider

export const theme = {
  colors: {
    // Background colors
    bgPrimary: '#121212',
    bgSecondary: '#0d0d0d',
    bgTertiary: '#1a1a1a',
    bgCard: '#1e1e1e',
    bgOverlay: 'rgba(30,30,30,0.85)',
    bgDark: '#18171c',
    bgMedium: '#23222b',
    
    // Text colors
    textPrimary: '#fff',
    textSecondary: '#f1f1f1',
    textMuted: '#ccc',
    textDim: '#aaa',
    textDimmed: '#dfdfdfff',
    
    // Accent colors
    accentPrimary: '#60519b',
    accentSecondary: '#8e7ce8',
    accentTertiary: '#5ebdd5ff',
    accentGreen: '#5aa98dff',
    accentYellow: '#ffcc00',
    accentSuccess: '#4CAF50',
    
    // Gradient colors
    gradientPurple: 'linear-gradient(135deg, #60519b, #8e7ce8)',
    gradientDark: 'linear-gradient(135deg, #18171c, #23222b)',
    gradientMulti: 'linear-gradient(135deg, #ff4d4d, #ffcc00, #4dff88)',
    
    // UI colors
    borderPrimary: '#60519b',
    shadowPurple: 'rgba(96, 81, 155, 0.8)',
    shadowDark: 'rgba(0, 0, 0, 0.4)',
    shadowLight: 'rgba(0, 0, 0, 0.2)',
    overlayDark: 'rgba(30,30,30,0.7)',
    backdropBlur: 'rgba(0, 0, 0, 0.5)',
    
    // Stars/particles
    starColor: '#aaa',
    
    // Review/rating
    starGold: '#ffd700',
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '2.5rem',   // 40px
    xxxl: '3rem',    // 48px
  },
  
  fonts: {
    primary: "'Montserrat', 'Segoe UI', Arial, sans-serif",
    heading: "'Honk', sans-serif",
    tech: "'Orbitron', sans-serif",
    display: "'Bungee', sans-serif",
  },
  
  fontSizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    md: '1.125rem',  // 18px
    lg: '1.25rem',   // 20px
    xl: '1.5rem',    // 24px
    xxl: '2rem',     // 32px
    xxxl: '3rem',    // 48px
    display: '5rem', // 80px
  },
  
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  borderRadius: {
    sm: '5px',
    md: '8px',
    lg: '16px',
    xl: '18px',
    xxl: '20px',
    xxxl: '32px',
    full: '50%',
    pill: '999px',
  },
  
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 15px rgba(0, 0, 0, 0.2)',
    lg: '0 4px 20px rgba(0, 0, 0, 0.6)',
    xl: '0 8px 25px rgba(96, 81, 155, 0.8)',
    xxl: '0px 8px 32px rgba(0,0,0,0.6)',
    text: '1px 1px 8px rgba(0,0,0,0.4)',
    textDark: '1px 1px 8px #000',
    textLight: '2px 2px 5px rgba(0, 0, 0, 0.5)',
  },
  
  transitions: {
    fast: '0.18s',
    base: '0.2s',
    medium: '0.3s',
    slow: '0.5s',
  },
  
  breakpoints: {
    mobile: '600px',
    tablet: '768px',
    desktop: '900px',
    wide: '1200px',
  },
  
  zIndex: {
    background: -1,
    base: 1,
    content: 2,
    overlay: 3,
    dropdown: 10,
    modal: 20,
    tooltip: 30,
  },
};

export default theme;
