# Coteline Pro 🏗️

Application mobile pour artisans menuisiers - Prise de mesures techniques et gestion de projets.

## 🎯 Description

Coteline Pro est une application mobile conçue pour faciliter le travail des artisans menuisiers lors de leurs visites techniques. Elle permet de créer des projets, gérer des clients, sélectionner des produits et prendre des mesures précises.

## 🚀 Fonctionnalités

- ✅ **Navigation** - Stack et Tab navigation configurées
- ✅ **Thème** - Système de thème unifié avec react-native-unistyles
- ✅ **Base de données** - Supabase intégré avec services complets
- ✅ **Écrans principaux** - Projets, Clients, Produits connectés à Supabase
- ✅ **Hooks personnalisés** - Hooks React pour la gestion des données
- ✅ **Composants** - Composants réutilisables avec états de chargement
- ✅ **Tests** - Scripts de test pour les services et la connectivité
- ⏳ **Authentification** - À implémenter
- ⏳ **Formulaires** - Création/édition des entités

## 🛠️ Technologies

- **React Native** avec Expo
- **TypeScript** pour la sécurité des types
- **Supabase** pour la base de données et l'authentification
- **React Native Unistyles** pour le système de thème
- **Expo Router** pour la navigation
- **Bun** comme gestionnaire de paquets

## 📦 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd coteline

# Installer les dépendances
bun install

# Configurer les variables d'environnement
cp .env.local.example .env.local
# Éditer .env.local avec vos clés Supabase

# Appliquer les migrations Supabase
bun run db:push

# Générer les types TypeScript
bun run db:types

# Démarrer l'application
bun run start
```

## 🗄️ Base de données

La base de données Supabase est configurée avec :

- **Clients** - Informations des clients et leurs adresses
- **Produits** - Catalogue des produits avec catégories et spécifications
- **Projets** - Projets clients avec produits associés
- **Migrations** - Schéma versionné et données de test

Voir [supabase/README.md](./supabase/README.md) pour plus de détails.

## 🧪 Tests

```bash
# Tester la connexion Supabase
bun run test:supabase

# Tester tous les services
bun run test:services

# Exécuter tous les tests
bun run test:all
```

## 📱 Scripts disponibles

```bash
# Développement
bun run start          # Démarrer Expo
bun run android        # Lancer sur Android
bun run ios           # Lancer sur iOS
bun run web           # Lancer sur le web

# Base de données
bun run db:push       # Appliquer les migrations
bun run db:types      # Générer les types TypeScript
bun run db:diff       # Voir les différences
bun run db:reset      # Reset de la DB locale

# Tests
bun run test:supabase # Test de connexion
bun run test:services # Test des services
bun run test:all      # Tous les tests
```

## 📁 Structure du projet

```
coteline/
├── app/                    # Écrans et navigation (Expo Router)
│   ├── (tabs)/            # Écrans avec onglets
│   ├── customer/          # Écrans détail client
│   └── project/           # Écrans détail projet
├── components/            # Composants réutilisables
├── hooks/                 # Hooks personnalisés
├── services/              # Services Supabase
├── types/                 # Types TypeScript
├── supabase/              # Configuration et migrations
└── scripts/               # Scripts de test et utilitaires
```

## 🎨 Thème et Design

L'application utilise un système de thème unifié avec :

- Couleurs cohérentes
- Typographie standardisée
- Espacements harmonieux
- Composants accessibles

## 🔄 Prochaines étapes

1. **Authentification Supabase** - Login/logout des utilisateurs
2. **Formulaires de création** - Ajouter/modifier clients, projets, produits
3. **Prise de mesures** - Interface pour saisir les dimensions
4. **Génération de devis** - Export PDF des projets
5. **Mode hors-ligne** - Synchronisation des données
6. **Workspaces collaboratifs** - Partage entre équipes

## 📄 Licence

Ce projet est privé et destiné à un usage commercial.

---

**Développé avec ❤️ pour les artisans menuisiers**
