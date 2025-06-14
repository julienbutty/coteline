import React, { useState, useMemo, useRef } from 'react';
import { 
  View, 
  Text, 
  SectionList, 
  TouchableOpacity, 
  TextInput,
  Dimensions 
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Client } from '../types';

interface ContactsListProps {
  clients: Client[];
  onClientPress: (clientId: string) => void;
  loading?: boolean;
}

interface ClientSection {
  title: string;
  data: Client[];
}

export function ContactsList({ clients, onClientPress, loading = false }: ContactsListProps) {
  const { theme } = useUnistyles();
  const styles = stylesheet(theme);
  const [searchQuery, setSearchQuery] = useState('');
  const sectionListRef = useRef<SectionList>(null);

  // Filtrer et grouper les clients par lettre
  const sectionsData = useMemo(() => {
    // Filtrer par recherche
    const filteredClients = clients.filter(client => {
      const searchLower = searchQuery.toLowerCase();
      const fullName = `${client.prenom || ''} ${client.nom}`.toLowerCase();
      const company = (client.entreprise || '').toLowerCase();
      const email = client.email.toLowerCase();
      
      return fullName.includes(searchLower) || 
             company.includes(searchLower) || 
             email.includes(searchLower);
    });

    // Grouper par première lettre du nom de famille
    const grouped = filteredClients.reduce((acc, client) => {
      const firstLetter = client.nom.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(client);
      return acc;
    }, {} as Record<string, Client[]>);

    // Convertir en format SectionList et trier
    const sections: ClientSection[] = Object.keys(grouped)
      .sort()
      .map(letter => ({
        title: letter,
        data: grouped[letter].sort((a, b) => a.nom.localeCompare(b.nom))
      }));

    return sections;
  }, [clients, searchQuery]);

  // Générer l'index alphabétique
  const alphabetIndex = useMemo(() => {
    const letters = sectionsData.map(section => section.title);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    return alphabet.map(letter => ({
      letter,
      available: letters.includes(letter)
    }));
  }, [sectionsData]);

  // Naviguer vers une section
  const scrollToSection = (letter: string) => {
    const sectionIndex = sectionsData.findIndex(section => section.title === letter);
    if (sectionIndex !== -1 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        animated: true,
      });
    }
  };

  // Obtenir le nom d'affichage
  const getDisplayName = (client: Client) => {
    if (client.entreprise) {
      return client.entreprise;
    }
    return `${client.prenom || ''} ${client.nom}`.trim();
  };

  // Obtenir l'info secondaire
  const getSecondaryInfo = (client: Client) => {
    if (client.entreprise && client.prenom) {
      return `${client.prenom} ${client.nom}`;
    }
    return client.email;
  };

  // Rendu d'un client
  const renderClient = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={styles.clientRow}
      onPress={() => onClientPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.clientInfo}>
        <Text style={styles.clientName} numberOfLines={1}>
          {getDisplayName(item)}
        </Text>
        <Text style={styles.clientSecondary} numberOfLines={1}>
          {getSecondaryInfo(item)}
        </Text>
      </View>
      
      <View style={styles.clientMeta}>
        {item.projets.length > 0 && (
          <View style={styles.projectsBadge}>
            <Text style={styles.projectsCount}>{item.projets.length}</Text>
          </View>
        )}
        <MaterialIcons 
          name="chevron-right" 
          size={20} 
          color={theme.colors.textTertiary} 
        />
      </View>
    </TouchableOpacity>
  );

  // Rendu de l'en-tête de section
  const renderSectionHeader = ({ section }: { section: ClientSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  // Séparateur entre les éléments
  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <MaterialIcons 
          name="search" 
          size={20} 
          color={theme.colors.textSecondary} 
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un client..."
          placeholderTextColor={theme.colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Liste des clients */}
      <View style={styles.listContainer}>
        <SectionList
          ref={sectionListRef}
          sections={sectionsData}
          renderItem={renderClient}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={renderSeparator}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={styles.listContent}
        />

        {/* Index alphabétique */}
        <View style={styles.alphabetIndex}>
          {alphabetIndex.map(({ letter, available }) => (
            <TouchableOpacity
              key={letter}
              style={[
                styles.indexLetter,
                !available && styles.indexLetterDisabled
              ]}
              onPress={() => available && scrollToSection(letter)}
              disabled={!available}
            >
              <Text
                style={[
                  styles.indexLetterText,
                  !available && styles.indexLetterTextDisabled
                ]}
              >
                {letter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Message si aucun résultat */}
      {sectionsData.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <MaterialIcons 
            name="person-search" 
            size={48} 
            color={theme.colors.textTertiary} 
          />
          <Text style={styles.emptyText}>
            {searchQuery ? 'Aucun client trouvé' : 'Aucun client enregistré'}
          </Text>
          {searchQuery && (
            <Text style={styles.emptySubtext}>
              Essayez avec d'autres mots-clés
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const stylesheet = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderRadius: theme.radius.lg,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
    },
    listContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    listContent: {
      paddingBottom: theme.spacing.xl,
    },
    clientRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      minHeight: 60,
    },
    clientInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    clientName: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: 2,
    },
    clientSecondary: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    clientMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    projectsBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.full,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    projectsCount: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.surface,
    },
    sectionHeader: {
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginLeft: theme.spacing.lg,
    },
    alphabetIndex: {
      position: 'absolute',
      right: 4,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
    },
    indexLetter: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 16,
    },
    indexLetterDisabled: {
      opacity: 0.3,
    },
    indexLetterText: {
      fontSize: 11,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.primary,
    },
    indexLetterTextDisabled: {
      color: theme.colors.textTertiary,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    emptySubtext: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
  });
