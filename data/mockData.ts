import { Client, Product, Project, ProjectProduct, ProductCategory } from '../types';

// Catégories de produits
export const productCategories: ProductCategory[] = [
  {
    id: '1',
    nom: 'Fenêtres',
    description: 'Fenêtres PVC, aluminium et bois',
    icon: 'window'
  },
  {
    id: '2',
    nom: 'Portes',
    description: 'Portes d\'entrée et intérieures',
    icon: 'door-front'
  },
  {
    id: '3',
    nom: 'Portails',
    description: 'Portails coulissants et battants',
    icon: 'gate'
  },
  {
    id: '4',
    nom: 'Volets',
    description: 'Volets roulants et battants',
    icon: 'window-restore'
  }
];

// Produits de base
export const products: Product[] = [
  // Fenêtres
  {
    id: 'prod-1',
    nom: 'Fenêtre PVC double vitrage',
    categoryId: '1',
    description: 'Fenêtre PVC haute performance avec double vitrage 4/16/4',
    type: 'fenetre',
    specifications: {
      materiaux: ['PVC Blanc', 'PVC Anthracite', 'PVC Chêne doré'],
      couleurs: ['Blanc', 'Anthracite', 'Chêne doré', 'Gris 7016'],
      typesVitrage: ['Double vitrage 4/16/4', 'Triple vitrage 4/16/4/16/4', 'Vitrage feuilleté'],
      systemeOuverture: ['Oscillo-battant', 'Battant simple', 'Coulissant', 'Fixe']
    },
    dimensionsParDefaut: {
      largeurMin: 400,
      largeurMax: 2400,
      hauteurMin: 500,
      hauteurMax: 2200
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'prod-2',
    nom: 'Fenêtre Aluminium',
    categoryId: '1',
    description: 'Fenêtre aluminium à rupture de pont thermique',
    type: 'fenetre',
    specifications: {
      materiaux: ['Aluminium laqué', 'Aluminium anodisé'],
      couleurs: ['Blanc RAL 9016', 'Anthracite RAL 7016', 'Bronze', 'Inox'],
      typesVitrage: ['Double vitrage 4/16/4', 'Triple vitrage', 'Vitrage acoustique'],
      systemeOuverture: ['Oscillo-battant', 'Coulissant', 'Fixe', 'Basculant']
    },
    dimensionsParDefaut: {
      largeurMin: 500,
      largeurMax: 3000,
      hauteurMin: 600,
      hauteurMax: 2500
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  // Portes
  {
    id: 'prod-3',
    nom: 'Porte d\'entrée PVC',
    categoryId: '2',
    description: 'Porte d\'entrée PVC isolante avec serrure 3 points',
    type: 'porte',
    specifications: {
      materiaux: ['PVC renforcé', 'PVC + Aluminium'],
      couleurs: ['Blanc', 'Anthracite', 'Chêne', 'Noyer'],
      systemeOuverture: ['Battant droit', 'Battant gauche', 'Semi-fixe']
    },
    dimensionsParDefaut: {
      largeurMin: 800,
      largeurMax: 1200,
      hauteurMin: 2000,
      hauteurMax: 2200
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  // Portails
  {
    id: 'prod-4',
    nom: 'Portail aluminium coulissant',
    categoryId: '3',
    description: 'Portail aluminium motorisé avec rails au sol',
    type: 'portail',
    specifications: {
      materiaux: ['Aluminium laqué', 'Aluminium + Composite'],
      couleurs: ['Anthracite RAL 7016', 'Blanc RAL 9016', 'Vert RAL 6005'],
      systemeOuverture: ['Coulissant motorisé', 'Coulissant manuel']
    },
    dimensionsParDefaut: {
      largeurMin: 3000,
      largeurMax: 6000,
      hauteurMin: 1500,
      hauteurMax: 2000
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

// Clients
export const clients: Client[] = [
  {
    id: 'client-1',
    nom: 'Dupont',
    prenom: 'Jean-Pierre',
    entreprise: 'Dupont Constructions SARL',
    email: 'jp.dupont@dupont-constructions.fr',
    telephone: '06 12 34 56 78',
    adresse: {
      rue: '15 Avenue des Chênes',
      ville: 'Lyon',
      codePostal: '69003',
      pays: 'France'
    },
    projets: ['proj-1', 'proj-3'],
    notes: 'Client fidèle depuis 5 ans. Préfère les matériaux haut de gamme.',
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-11-20')
  },
  {
    id: 'client-2',
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@gmail.com',
    telephone: '07 23 45 67 89',
    adresse: {
      rue: '42 Rue de la Paix',
      ville: 'Villeurbanne',
      codePostal: '69100',
      pays: 'France'
    },
    projets: ['proj-2'],
    notes: 'Rénovation complète maison individuelle. Budget serré.',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-11-18')
  },
  {
    id: 'client-3',
    nom: 'Société Habitat Plus',
    entreprise: 'Habitat Plus SA',
    email: 'contact@habitat-plus.com',
    telephone: '04 78 90 12 34',
    adresse: {
      rue: '28 Boulevard Vivier Merle',
      ville: 'Lyon',
      codePostal: '69003',
      pays: 'France'
    },
    projets: ['proj-4'],
    notes: 'Promoteur immobilier. Commandes importantes et régulières.',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-11-15')
  }
];

// Projets avec produits
export const projects: Project[] = [
  {
    id: 'proj-1',
    nom: 'Résidence Les Chênes',
    description: 'Rénovation complète des menuiseries extérieures - 24 logements',
    clientId: 'client-1',
    client: clients[0],
    produits: [], // Sera rempli ci-dessous
    statut: 'en_cours',
    adresseChantier: {
      rue: '88 Rue des Érables',
      ville: 'Décines-Charpieu',
      codePostal: '69150',
      pays: 'France'
    },
    dateDebutPrevue: new Date('2024-09-01'),
    dateFinPrevue: new Date('2024-12-15'),
    notes: 'Chantier en cours. Attention aux contraintes de copropriété.',
    tags: ['rénovation', 'collectif', 'urgent'],
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-11-20')
  },
  {
    id: 'proj-2',
    nom: 'Maison individuelle Martin',
    description: 'Remplacement de toutes les menuiseries',
    clientId: 'client-2',
    client: clients[1],
    produits: [],
    statut: 'brouillon',
    adresseChantier: {
      rue: '42 Rue de la Paix',
      ville: 'Villeurbanne',
      codePostal: '69100',
      pays: 'France'
    },
    dateDebutPrevue: new Date('2024-12-01'),
    dateFinPrevue: new Date('2025-01-31'),
    notes: 'Mesures à finaliser avant production.',
    tags: ['individuel', 'rénovation'],
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-11-18')
  },
  {
    id: 'proj-3',
    nom: 'Extension Dupont',
    description: 'Menuiseries pour extension de maison',
    clientId: 'client-1',
    client: clients[0],
    produits: [],
    statut: 'termine',
    notes: 'Projet terminé, toutes les mesures validées.',
    tags: ['extension', 'neuf'],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-05-20')
  },
  {
    id: 'proj-4',
    nom: 'Immeuble centre-ville',
    description: 'Menuiseries aluminium pour immeuble neuf 48 logements',
    clientId: 'client-3',
    client: clients[2],
    produits: [],
    statut: 'en_cours',
    adresseChantier: {
      rue: '156 Cours Lafayette',
      ville: 'Lyon',
      codePostal: '69003',
      pays: 'France'
    },
    dateDebutPrevue: new Date('2024-10-01'),
    dateFinPrevue: new Date('2025-03-31'),
    notes: 'Gros chantier en cours. Mesures par phases.',
    tags: ['neuf', 'collectif', 'aluminium'],
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-11-15')
  }
];

// Produits dans les projets
export const projectProducts: ProjectProduct[] = [
  // Projet Résidence Les Chênes
  {
    id: 'pp-1',
    productId: 'prod-1',
    projectId: 'proj-1',
    product: products[0],
    quantite: 24,
    dimensions: {
      largeur: 1200,
      hauteur: 1400
    },
    parametres: {
      materiau: 'PVC Blanc',
      couleur: 'Blanc',
      vitrage: 'Double vitrage 4/16/4',
      ouverture: 'Oscillo-battant'
    },
    notes: 'Fenêtres salon - étage',
    statut: 'valide',
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-09-15')
  },
  {
    id: 'pp-2',
    productId: 'prod-1',
    projectId: 'proj-1',
    product: products[0],
    quantite: 48,
    dimensions: {
      largeur: 800,
      hauteur: 1200
    },
    parametres: {
      materiau: 'PVC Blanc',
      couleur: 'Blanc',
      vitrage: 'Double vitrage 4/16/4',
      ouverture: 'Oscillo-battant'
    },
    notes: 'Fenêtres chambres',
    prixUnitaire: 380,
    statut: 'valide',
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-09-15')
  },
  // Projet Maison Martin
  {
    id: 'pp-3',
    productId: 'prod-1',
    projectId: 'proj-2',
    product: products[0],
    quantite: 8,
    dimensions: {
      largeur: 1000,
      hauteur: 1300
    },
    parametres: {
      materiau: 'PVC Anthracite',
      couleur: 'Anthracite',
      vitrage: 'Double vitrage 4/16/4',
      ouverture: 'Oscillo-battant'
    },
    notes: 'Fenêtres façade principale',
    prixUnitaire: 480,
    statut: 'brouillon',
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-11-10')
  },
  {
    id: 'pp-4',
    productId: 'prod-3',
    projectId: 'proj-2',
    product: products[2],
    quantite: 1,
    dimensions: {
      largeur: 900,
      hauteur: 2100
    },
    parametres: {
      materiau: 'PVC renforcé',
      couleur: 'Anthracite',
      ouverture: 'Battant droit'
    },
    notes: 'Porte d\'entrée principale',
    prixUnitaire: 1200,
    statut: 'brouillon',
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-11-10')
  },
  // Projet Immeuble centre-ville
  {
    id: 'pp-5',
    productId: 'prod-2',
    projectId: 'proj-4',
    product: products[1],
    quantite: 156,
    dimensions: {
      largeur: 1400,
      hauteur: 1600
    },
    parametres: {
      materiau: 'Aluminium laqué',
      couleur: 'Anthracite RAL 7016',
      vitrage: 'Double vitrage 4/16/4',
      ouverture: 'Oscillo-battant'
    },
    notes: 'Fenêtres séjours - tous étages',
    prixUnitaire: 680,
    statut: 'commande',
    createdAt: new Date('2024-07-15'),
    updatedAt: new Date('2024-10-20')
  }
];

// Ajouter les produits aux projets
projects[0].produits = [projectProducts[0], projectProducts[1]];
projects[1].produits = [projectProducts[2], projectProducts[3]];
projects[3].produits = [projectProducts[4]]; 