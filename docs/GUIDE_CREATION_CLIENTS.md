# 📋 Guide de Création de Clients - Coteline Pro

## 🎯 Vue d'ensemble

Le système de création de clients permet aux artisans menuisiers d'ajouter facilement de nouveaux clients à leur carnet d'adresses avec toutes les informations nécessaires pour la gestion de projets.

## 🚀 Fonctionnalités implémentées

### ✅ Écran de liste des clients (`app/(tabs)/customers.tsx`)
- **Header dynamique** : Affiche le nombre de clients enregistrés
- **Bouton d'ajout** : Dans le header pour accès rapide
- **Bouton d'action flottant (FAB)** : "Nouveau client" avec icône
- **Liste des clients** : Avec informations essentielles
- **Navigation** : Vers les détails ou création

### ✅ Écran de création (`app/customer/create.tsx`)
- **Formulaire complet** : Toutes les informations client
- **Validation en temps réel** : Champs obligatoires et formats
- **Gestion d'erreurs** : Messages d'erreur contextuels
- **Sauvegarde** : Bouton dans le header + bouton principal
- **Navigation** : Retour ou redirection vers le client créé

### ✅ Hook de création (`hooks/useSupabase.ts`)
- **useCreateClient** : Gestion d'état pour la création
- **Gestion d'erreurs** : Capture et affichage des erreurs
- **Loading state** : Indicateur de chargement

### ✅ Composants réutilisables
- **FloatingActionButton** : Bouton d'action flottant
- **ValidatedInput** : Champ de saisie avec validation
- **Header** : Header avec actions personnalisées

## 📱 Comment tester

### 1. Accéder à la création de clients

**Option A - Via le header :**
1. Aller dans l'onglet "Clients"
2. Cliquer sur le bouton "+" dans le header

**Option B - Via le FAB :**
1. Aller dans l'onglet "Clients"
2. Cliquer sur le bouton flottant "Nouveau client"

### 2. Remplir le formulaire

**Informations obligatoires (marquées d'un *) :**
- Nom
- Email (format validé)
- Téléphone
- Adresse : Rue, Code postal, Ville

**Informations optionnelles :**
- Prénom
- Entreprise
- Pays (pré-rempli avec "France")
- Notes

### 3. Validation en temps réel

**Champs validés automatiquement :**
- **Email** : Format `email@domaine.com`
- **Téléphone** : Minimum 10 caractères
- **Champs obligatoires** : Non vides

**Indicateurs visuels :**
- ✅ Vert : Champ valide
- ❌ Rouge : Erreur
- Bordure bleue : Champ actif

### 4. Sauvegarder

**Deux options :**
1. **Bouton header** : Icône ✓ en haut à droite
2. **Bouton principal** : "Créer le client" en bas

**Après création :**
- Popup de confirmation
- Choix : "Voir le client" ou "Retour à la liste"

## 🔧 Structure technique

### Types TypeScript
```typescript
interface Client {
  id: string;
  nom: string;
  prenom?: string;
  entreprise?: string;
  email: string;
  telephone: string;
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
  };
  projets: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Service Supabase
```typescript
// Création d'un client
const newClient = await ClientService.create(clientData);

// Hook personnalisé
const { createClient, loading, error } = useCreateClient();
```

### Navigation
```typescript
// Routes configurées
- /customer/create    // Création
- /customer/[id]      // Détails client
```

## 🎨 Design et UX

### Palette de couleurs
- **Primaire** : Bleu technique (#1E3A8A)
- **Succès** : Vert validation (#059669)
- **Erreur** : Rouge technique (#DC2626)
- **Surface** : Blanc/Gris selon le thème

### Animations et feedback
- **Boutons** : Effet de pression
- **Champs** : Bordure animée au focus
- **FAB** : Ombre et élévation
- **Validation** : Icônes de statut

### Accessibilité
- **Labels** : Lisibles par VoiceOver
- **Contraste** : AA minimum
- **Navigation** : Compatible clavier
- **Tailles** : Texte adaptable

## 🧪 Tests recommandés

### Tests fonctionnels
1. **Création complète** : Tous les champs remplis
2. **Champs obligatoires** : Validation des erreurs
3. **Formats invalides** : Email et téléphone incorrects
4. **Navigation** : Retour et redirection
5. **Thème sombre** : Vérifier la lisibilité

### Tests d'erreur
1. **Connexion réseau** : Création hors ligne
2. **Données invalides** : Caractères spéciaux
3. **Champs vides** : Soumission incomplète
4. **Doublons** : Email déjà existant

### Tests de performance
1. **Validation** : Temps de réponse
2. **Navigation** : Fluidité des transitions
3. **Mémoire** : Pas de fuites
4. **Chargement** : États intermédiaires

## 🔄 Évolutions futures

### Fonctionnalités prévues
- **Import contacts** : Depuis le carnet d'adresses
- **Géolocalisation** : Auto-complétion d'adresse
- **Photos** : Avatar client
- **Historique** : Suivi des modifications
- **Export** : Sauvegarde des données

### Améliorations UX
- **Auto-save** : Sauvegarde automatique
- **Suggestions** : Auto-complétion intelligente
- **Validation avancée** : SIRET, TVA
- **Templates** : Modèles de clients
- **Recherche** : Filtres avancés

## 📞 Support

En cas de problème :
1. Vérifier la connexion Supabase
2. Consulter les logs de développement
3. Tester en mode debug
4. Vérifier les permissions

---

**Coteline Pro** - Application de gestion de projets menuiserie
Version 1.0.0 - Création de clients implémentée ✅
