import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface MeasurementPickerProps {
  label: string;
  value?: number; // Valeur en millimètres
  onValueChange: (value: number) => void;
  placeholder?: string;
  maxValue?: number; // Valeur maximale en mm
}

const { height: screenHeight } = Dimensions.get('window');

export default function MeasurementPicker({ 
  label, 
  value, 
  onValueChange, 
  placeholder = "Sélectionner une mesure",
  maxValue = 5000 // 5 mètres par défaut
}: MeasurementPickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value || 0);

  // Générateur de valeurs en millimètres (pas de 10mm pour la fluidité)
  const millimeters = Array.from({ length: Math.floor(maxValue / 10) + 1 }, (_, i) => i * 10);

  const formatValue = (mm: number) => {
    if (mm === 0) return placeholder;
    if (mm >= 1000) {
      const meters = Math.floor(mm / 1000);
      const remainingMm = mm % 1000;
      return remainingMm > 0 ? `${meters}m ${remainingMm}mm` : `${meters}m`;
    }
    return `${mm}mm`;
  };

  const handleConfirm = () => {
    onValueChange(tempValue);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setTempValue(value || 0);
    setIsModalVisible(false);
  };

  const WheelPicker = ({ 
    values, 
    selectedValue, 
    onValueChange
  }: { 
    values: number[]; 
    selectedValue: number; 
    onValueChange: (value: number) => void;
  }) => {
    return (
      <View style={styles.wheelContainer}>
        <ScrollView 
          style={styles.wheel}
          showsVerticalScrollIndicator={false}
          snapToInterval={styles.wheelItem.height}
          decelerationRate="fast"
          contentContainerStyle={{ 
            paddingVertical: (screenHeight * 0.4 - styles.wheelItem.height) / 2 
          }}
        >
          {values.map((val) => (
            <Pressable
              key={val}
              style={[
                styles.wheelItem,
                selectedValue === val && styles.selectedWheelItem
              ]}
              onPress={() => onValueChange(val)}
            >
              <Text style={[
                styles.wheelItemText,
                selectedValue === val && styles.selectedWheelItemText
              ]}>
                {val}mm
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        
        {/* Indicateur de sélection */}
        <View style={styles.selectionIndicator} pointerEvents="none">
          <View style={styles.selectionLine} />
          <View style={[styles.selectionLine, { top: styles.wheelItem.height }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <Pressable 
        style={styles.inputButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={[
          styles.inputText,
          (!value || value === 0) && styles.placeholderText
        ]}>
          {value ? formatValue(value) : placeholder}
        </Text>
        <MaterialIcons name="unfold-more" size={24} color="#757575" />
      </Pressable>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Pressable onPress={handleCancel}>
                <Text style={styles.cancelButton}>Annuler</Text>
              </Pressable>
              <Text style={styles.modalTitle}>{label}</Text>
              <Pressable onPress={handleConfirm}>
                <Text style={styles.confirmButton}>OK</Text>
              </Pressable>
            </View>

            {/* Picker unique */}
            <View style={styles.pickersContainer}>
              <WheelPicker
                values={millimeters}
                selectedValue={tempValue}
                onValueChange={setTempValue}
              />
            </View>

            {/* Aperçu */}
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Mesure sélectionnée :</Text>
              <Text style={styles.previewValue}>
                {formatValue(tempValue)}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: 16,
  },
  
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  
  inputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    minHeight: 56,
  },
  
  inputText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  
  placeholderText: {
    color: theme.colors.textSecondary,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight * 0.6,
  },
  
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  cancelButton: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  
  confirmButton: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  
  pickersContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  wheelContainer: {
    flex: 1,
    position: 'relative',
  },
  
  wheel: {
    flex: 1,
  },
  
  wheelItem: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  wheelItemText: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    fontWeight: '400',
  },
  
  selectedWheelItem: {
    // Style visuel géré par l'indicateur
  },
  
  selectedWheelItemText: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 24,
  },
  
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 44,
    marginTop: -22,
    pointerEvents: 'none',
  },
  
  selectionLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: theme.colors.border,
    top: 0,
  },
  
  previewContainer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  
  previewLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  
  previewValue: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.primary,
  },
})); 