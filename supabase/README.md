# Supabase Configuration - Coteline Pro

## 🗄️ Configuration Base de données

### Prérequis

1. Compte Supabase créé sur [supabase.com](https://supabase.com)
2. Nouveau projet Supabase créé

### Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation du schéma

#### Méthode recommandée : CLI Supabase

1. **Installez la CLI** : `bun add -d supabase`
2. **Initialisez le projet** : `bunx supabase init`
3. **Liez au projet distant** : `bunx supabase link --project-ref ggkdvwovpdjalqiyuelh`
4. **Appliquez les migrations** : `bun run db:push`
5. **Générez les types** : `bun run db:types`

#### Méthode alternative : Dashboard

1. **Accédez au SQL Editor** dans votre dashboard Supabase
2. **Exécutez les migrations** dans l'ordre :
   - `001_initial_schema.sql` - Crée les tables principales
   - `002_seed_data.sql` - Ajoute les données de test

### Structure de la base de données

#### Tables principales

- **clients** - Informations clients
- **product_categories** - Catégories de produits (Fenêtres, Portes, etc.)
- **products** - Catalogue des produits
- **projects** - Projets clients
- **project_products** - Produits assignés aux projets avec mesures

#### Bonnes pratiques appliquées

✅ **Noms en anglais** pour les colonnes  
✅ **UUIDs** comme clés primaires  
✅ **Contraintes** et validations  
✅ **Index** pour les performances  
✅ **Triggers** pour updated_at automatique  
✅ **Relations** avec clés étrangères

### Test de la connexion

```typescript
import { supabase } from "./lib/supabase";

// Test simple
const testConnection = async () => {
  const { data, error } = await supabase.from("clients").select("*").limit(5);

  console.log("Clients:", data);
};
```

### Row Level Security (RLS)

🔐 **Important**: Activez RLS et créez des politiques pour sécuriser vos données :

```sql
-- Exemple de politique pour les clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients are viewable by authenticated users" ON clients
    FOR SELECT USING (auth.role() = 'authenticated');
```

### Services disponibles

- `ClientService` - CRUD pour les clients
- `ProjectService` - (à créer) CRUD pour les projets
- `ProductService` - (à créer) CRUD pour les produits

### Migration depuis les données mockées

Les services Supabase remplacent progressivement les données mock dans `/data/mockData.ts`.

### Scripts disponibles

```bash
# Tester la connexion Supabase
bun run test:supabase

# Appliquer les migrations
bun run db:push

# Générer les types TypeScript
bun run db:types

# Voir les différences avec la DB distante
bun run db:diff

# Reset de la DB locale (si développement local)
bun run db:reset
```

## 🚀 Prochaines étapes

1. ✅ Schema SQL créé
2. ✅ Service Client implémenté
3. ✅ CLI Supabase configurée
4. ✅ Types TypeScript générés
5. ⏳ Créer ProjectService
6. ⏳ Créer ProductService
7. ⏳ Intégrer l'authentification
8. ⏳ Configurer les politiques RLS
