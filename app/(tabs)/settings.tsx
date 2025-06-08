import React from 'react';
import { Text, View, ScrollView, Switch } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { useUnistyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = React.useState(UnistylesRuntime.themeName === 'dark');

  const toggleTheme = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    UnistylesRuntime.setTheme(newTheme);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Réglages</Text>
        <Text style={styles.subtitle}>Personnalisation et préférences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apparence</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Mode sombre</Text>
            <Text style={styles.settingDescription}>
              Interface adaptée pour les environnements peu éclairés
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleTheme}
            trackColor={{ 
              false: theme.colors.border, 
              true: theme.colors.primaryLight 
            }}
            thumbColor={darkMode ? theme.colors.primary : theme.colors.surface}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres par défaut</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Unité de mesure</Text>
            <Text style={styles.settingDescription}>Millimètres (mm)</Text>
          </View>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Matériau par défaut</Text>
            <Text style={styles.settingDescription}>PVC Blanc</Text>
          </View>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Type de vitrage</Text>
            <Text style={styles.settingDescription}>Double vitrage 4/16/4</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.appName}>Coteline Pro</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Application de gestion de projets menuiserie
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Documentation</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Contacter le support</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Signaler un problème</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
  },
  settingItem: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  appName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  appVersion: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  appDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.md,
  },
})); 