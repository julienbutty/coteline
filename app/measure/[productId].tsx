import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MeasurementPicker from '../../components/MeasurementPicker';

interface Measurement {
  id: string;
  label: string;
  value?: number; // Valeur en millimètres
  required: boolean;
}

export default function MeasureScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const insets = useSafeAreaInsets();
  
  // Exemple de mesures pour une fenêtre - pourrait venir d'une base de données
  const [measurements, setMeasurements] = useState<Measurement[]>([
    { id: '1', label: 'Largeur', required: true },
    { id: '2', label: 'Hauteur', required: true },
    { id: '3', label: 'Épaisseur du mur', required: true },
    { id: '4', label: 'Largeur tableau', required: false },
    { id: '5', label: 'Hauteur tableau', required: false },
    { id: '6', label: 'Hauteur allège', required: false },
  ]);

  const [notes, setNotes] = useState('');

  const updateMeasurement = (id: string, value: number) => {
    setMeasurements(prev => 
      prev.map(m => m.id === id ? { ...m, value } : m)
    );
  };

  const getCompletionStats = () => {
    const required = measurements.filter(m => m.required);
    const completed = required.filter(m => m.value && m.value > 0);
    return { completed: completed.length, total: required.length };
  };

  const stats = getCompletionStats();
  const isComplete = stats.completed === stats.total;

  const handleSave = () => {
    if (!isComplete) {
      // Feedback haptique pour erreur
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Mesures incomplètes',
        'Veuillez renseigner toutes les mesures obligatoires avant de sauvegarder.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    // Feedback haptique pour succès
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Ici on sauvegarderait les mesures
    Alert.alert(
      'Mesures sauvegardées',
      'Les mesures ont été enregistrées avec succès.',
      [
        { 
          text: 'OK', 
          onPress: () => router.back(),
          style: 'default' 
        }
      ]
    );
  };

  const formatTotalValue = (value?: number) => {
    if (!value || value === 0) return '0mm';
    if (value >= 1000) {
      const meters = Math.floor(value / 1000);
      const remainingMm = value % 1000;
      return remainingMm > 0 ? `${meters}m ${remainingMm}mm` : `${meters}m`;
    }
    return `${value}mm`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.headerTop}>
          <Pressable 
            style={styles.backButton} 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.back();
            }}
            hitSlop={8}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FF6B35" />
          </Pressable>
          <Text style={styles.headerTitle}>Prise de mesures</Text>
          <View style={styles.placeholder} />
        </View>
        
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(stats.completed / stats.total) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {stats.completed}/{stats.total} mesures obligatoires
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Section Mesures obligatoires */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="straighten" size={24} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Mesures obligatoires</Text>
          </View>
          
          {measurements.filter(m => m.required).map((measurement) => (
            <MeasurementPicker
              key={measurement.id}
              label={measurement.label}
              value={measurement.value}
              onValueChange={(value) => updateMeasurement(measurement.id, value)}
            />
          ))}
        </View>

        {/* Section Mesures optionnelles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="straighten" size={24} color="#9E9E9E" />
            <Text style={styles.sectionTitle}>Mesures optionnelles</Text>
          </View>
          
          {measurements.filter(m => !m.required).map((measurement) => (
            <MeasurementPicker
              key={measurement.id}
              label={measurement.label}
              value={measurement.value}
              onValueChange={(value) => updateMeasurement(measurement.id, value)}
            />
          ))}
        </View>

        {/* Section Récapitulatif */}
        {measurements.some(m => m.value) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="summarize" size={24} color="#FF6B35" />
              <Text style={styles.sectionTitle}>Récapitulatif</Text>
            </View>
            
            <View style={styles.summaryCard}>
              {measurements
                .filter(m => m.value)
                .map((measurement) => (
                  <View key={measurement.id} style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{measurement.label} :</Text>
                    <Text style={styles.summaryValue}>
                      {formatTotalValue(measurement.value)}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Section Actions rapides */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="flash-on" size={24} color="#FF6B35" />
            <Text style={styles.sectionTitle}>Actions rapides</Text>
          </View>
          
          <View style={styles.quickActions}>
            <Pressable 
              style={styles.quickActionButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              hitSlop={4}
            >
              <MaterialIcons name="photo-camera" size={24} color="#FF6B35" />
              <Text style={styles.quickActionText}>Photo</Text>
            </Pressable>
            
            <Pressable 
              style={styles.quickActionButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              hitSlop={4}
            >
              <MaterialIcons name="mic" size={24} color="#FF6B35" />
              <Text style={styles.quickActionText}>Vocal</Text>
            </Pressable>
            
            <Pressable 
              style={styles.quickActionButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              hitSlop={4}
            >
              <MaterialIcons name="note-add" size={24} color="#FF6B35" />
              <Text style={styles.quickActionText}>Note</Text>
            </Pressable>
          </View>
        </View>

        {/* Espace pour le bouton flottant */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Bouton de sauvegarde */}
      <View style={styles.floatingButtonContainer}>
        <Pressable 
          style={[
            styles.saveButton,
            isComplete && styles.saveButtonActive
          ]}
          onPress={handleSave}
        >
          <MaterialIcons 
            name={isComplete ? "check" : "save"} 
            size={24} 
            color={isComplete ? "#FFFFFF" : "#9E9E9E"} 
          />
          <Text style={[
            styles.saveButtonText,
            isComplete && styles.saveButtonTextActive
          ]}>
            {isComplete ? "Terminer" : "Sauvegarder"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  backButton: {
    width: 48, // Augmenté de 40 à 48px pour meilleure surface tactile
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  
  placeholder: {
    width: 40,
  },
  
  progressContainer: {
    gap: 8,
  },
  
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  scrollView: {
    flex: 1,
  },
  
  section: {
    padding: 20,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  summaryLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  
  quickActionButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20, // Augmenté de 16 à 20px pour meilleure surface tactile
    alignItems: 'center',
    gap: 8,
    minHeight: 80, // Hauteur minimale pour surface tactile confortable
  },
  
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  
  bottomSpace: {
    height: 100, // Espace pour le bouton flottant
  },
  
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20, // Augmenté de 18 à 20px pour meilleure surface tactile
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 64, // Hauteur minimale recommandée pour les boutons principaux
  },
  
  saveButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  
  saveButtonTextActive: {
    color: '#FFFFFF',
  },
})); 