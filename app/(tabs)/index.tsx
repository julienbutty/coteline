import { StyleSheet } from 'react-native-unistyles';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coteline avec Unistyles 3! 🎨</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Unistyles Feature</Text>
        <Text style={styles.cardText}>✅ Thèmes automatiques (light/dark)</Text>
        <Text style={styles.cardText}>✅ Breakpoints responsives</Text>
        <Text style={styles.cardText}>✅ Performance native</Text>
        <Text style={styles.cardText}>✅ TypeScript complet</Text>
      </View>
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    fontSize: {
      xs: 18,
      sm: 20,
      md: 24,
    },
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  separator: {
    marginVertical: theme.spacing.xl,
    height: 1,
    width: '80%',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
}));
