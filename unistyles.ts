import { StyleSheet } from 'react-native-unistyles'

const lightTheme = {
  colors: {
    // Couleurs principales menuiserie
    primary: '#FF6B35', // Orange menuiserie
    primaryLight: '#FF8A65',
    primaryDark: '#E64A19',
    
    // Couleurs secondaires
    secondary: '#2E7D32', // Vert nature/bois
    secondaryLight: '#4CAF50',
    secondaryDark: '#1B5E20',
    
    // Couleurs neutres
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    
    // Textes
    text: '#212121',
    textSecondary: '#757575',
    textTertiary: '#9E9E9E',
    
    // États
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Bordures et dividers
    border: '#E0E0E0',
    divider: '#EEEEEE',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(0, 0, 0, 0.3)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    // Tailles de police
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
    },
    // Hauteurs de ligne
    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
      xxl: 36,
      xxxl: 42,
    },
    // Poids de police
    fontWeight: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 999,
  },
  shadows: {
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.22,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  gap: (v: number) => v * 8,
}

const darkTheme = {
  colors: {
    // Couleurs principales menuiserie (adaptées dark)
    primary: '#FF7043',
    primaryLight: '#FF8A65',
    primaryDark: '#E64A19',
    
    // Couleurs secondaires
    secondary: '#66BB6A',
    secondaryLight: '#81C784',
    secondaryDark: '#4CAF50',
    
    // Couleurs neutres dark
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2D2D2D',
    
    // Textes dark
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textTertiary: '#757575',
    
    // États dark
    success: '#66BB6A',
    warning: '#FFB74D',
    error: '#EF5350',
    info: '#42A5F5',
    
    // Bordures et dividers dark
    border: '#404040',
    divider: '#2D2D2D',
    
    // Overlay dark
    overlay: 'rgba(0, 0, 0, 0.7)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
  radius: lightTheme.radius,
  shadows: {
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  gap: (v: number) => v * 8,
}

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
}

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
}

type AppBreakpoints = typeof breakpoints
type AppThemes = typeof appThemes

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    initialTheme: 'light',
  },
  breakpoints,
  themes: appThemes,
}) 