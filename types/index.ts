// Types pour l'application de menuiserie

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  entreprise?: string;
  telephone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
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
  projets: string[]; // IDs des projets
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  nom: string;
  description: string;
  icon: string;
}

export interface Product {
  id: string;
  nom: string;
  categoryId: string;
  description: string;
  type: 'fenetre' | 'porte' | 'portail' | 'volet';
  specifications: {
    materiaux: string[];
    couleurs: string[];
    typesVitrage?: string[];
    systemeOuverture?: string[];
  };
  dimensionsParDefaut: {
    largeurMin: number;
    largeurMax: number;
    hauteurMin: number;
    hauteurMax: number;
  };
  prixUnitaire?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectProduct {
  id: string;
  productId: string;
  projectId: string;
  product: Product;
  quantite: number;
  dimensions: {
    largeur: number;
    hauteur: number;
    profondeur?: number;
  };
  parametres: {
    materiau: string;
    couleur: string;
    vitrage?: string;
    ouverture?: string;
    options?: string[];
  };
  notes?: string;
  prixUnitaire?: number;
  statut: 'brouillon' | 'valide' | 'commande';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  nom: string;
  description?: string;
  clientId: string;
  client: Client;
  produits: ProjectProduct[];
  statut: 'brouillon' | 'en_cours' | 'termine' | 'annule';
  adresseChantier?: {
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
  };
  dateDebutPrevue?: Date;
  dateFinPrevue?: Date;
  budget?: {
    estime: number;
    reel?: number;
  };
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type StatutProject = Project['statut'];
export type TypeProduct = Product['type']; 