import { StyleSheet } from "react-native-unistyles";

const lightTheme = {
  colors: {
    // Couleurs principales techniques - Bleu acier industriel
    primary: "#1E3A8A", // Bleu acier profond
    primaryLight: "#3B82F6", // Bleu technique clair
    primaryDark: "#1E40AF", // Bleu marine foncé

    // Couleurs secondaires - Gris métallique
    secondary: "#475569", // Gris ardoise technique
    secondaryLight: "#64748B", // Gris métallique clair
    secondaryDark: "#334155", // Gris anthracite

    // Couleurs neutres - Tons industriels
    background: "#F8FAFC", // Gris très clair technique
    surface: "#FFFFFF",
    surfaceVariant: "#F1F5F9", // Gris clair industriel

    // Textes - Contraste technique
    text: "#0F172A", // Noir technique
    textSecondary: "#475569", // Gris technique moyen
    textTertiary: "#94A3B8", // Gris technique clair

    // États - Palette technique
    success: "#059669", // Vert technique (validation)
    warning: "#D97706", // Orange technique (attention)
    error: "#DC2626", // Rouge technique (erreur)
    info: "#0284C7", // Bleu info technique

    // Bordures et dividers - Tons métalliques
    border: "#CBD5E1", // Gris bordure technique
    divider: "#E2E8F0", // Gris divider clair

    // Overlay - Tons industriels
    overlay: "rgba(15, 23, 42, 0.6)", // Overlay technique
    backdrop: "rgba(71, 85, 105, 0.4)", // Backdrop métallique
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
      light: "300" as const,
      regular: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
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
};

const darkTheme = {
  colors: {
    // Couleurs principales techniques dark - Bleu acier industriel
    primary: "#3B82F6", // Bleu technique lumineux
    primaryLight: "#60A5FA", // Bleu clair technique
    primaryDark: "#1D4ED8", // Bleu profond technique

    // Couleurs secondaires dark - Gris métallique
    secondary: "#64748B", // Gris métallique moyen
    secondaryLight: "#94A3B8", // Gris métallique clair
    secondaryDark: "#475569", // Gris ardoise foncé

    // Couleurs neutres dark - Tons industriels sombres
    background: "#0F172A", // Noir technique profond
    surface: "#1E293B", // Gris technique foncé
    surfaceVariant: "#334155", // Gris ardoise moyen

    // Textes dark - Contraste technique inversé
    text: "#F8FAFC", // Blanc technique
    textSecondary: "#CBD5E1", // Gris clair technique
    textTertiary: "#94A3B8", // Gris moyen technique

    // États dark - Palette technique adaptée
    success: "#10B981", // Vert technique lumineux
    warning: "#F59E0B", // Orange technique lumineux
    error: "#EF4444", // Rouge technique lumineux
    info: "#06B6D4", // Cyan technique

    // Bordures et dividers dark - Tons métalliques sombres
    border: "#475569", // Gris bordure technique foncé
    divider: "#334155", // Gris divider foncé

    // Overlay dark - Tons industriels profonds
    overlay: "rgba(15, 23, 42, 0.8)", // Overlay technique foncé
    backdrop: "rgba(30, 41, 59, 0.6)", // Backdrop métallique foncé
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
};

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    initialTheme: "light",
  },
  breakpoints,
  themes: appThemes,
});
