import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { Product, ProductCategory } from '../types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

type ProductCategoryRow = Database['public']['Tables']['product_categories']['Row'];
type ProductCategoryInsert = Database['public']['Tables']['product_categories']['Insert'];
type ProductCategoryUpdate = Database['public']['Tables']['product_categories']['Update'];

export class ProductService {
  // ==================== GESTION DES CATÉGORIES ====================

  // Récupérer toutes les catégories
  static async getAllCategories(): Promise<ProductCategory[]> {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Erreur lors de la récupération des catégories: ${error.message}`);
    }

    return data.map(this.mapRowToCategory);
  }

  // Récupérer une catégorie par ID
  static async getCategoryById(id: string): Promise<ProductCategory | null> {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Catégorie non trouvée
      }
      throw new Error(`Erreur lors de la récupération de la catégorie: ${error.message}`);
    }

    return this.mapRowToCategory(data);
  }

  // Créer une nouvelle catégorie
  static async createCategory(categoryData: Omit<ProductCategory, 'id'>): Promise<ProductCategory> {
    const insertData: ProductCategoryInsert = {
      name: categoryData.nom,
      description: categoryData.description,
    };

    const { data, error } = await supabase
      .from('product_categories')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création de la catégorie: ${error.message}`);
    }

    return this.mapRowToCategory(data);
  }

  // ==================== GESTION DES PRODUITS ====================

  // Récupérer tous les produits
  static async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des produits: ${error.message}`);
    }

    return data.map(this.mapRowToProduct);
  }

  // Récupérer les produits par catégorie
  static async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Erreur lors de la récupération des produits par catégorie: ${error.message}`);
    }

    return data.map(this.mapRowToProduct);
  }

  // Récupérer un produit par ID
  static async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Produit non trouvé
      }
      throw new Error(`Erreur lors de la récupération du produit: ${error.message}`);
    }

    return this.mapRowToProduct(data);
  }

  // Créer un nouveau produit
  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const insertData: ProductInsert = {
      name: productData.nom,
      description: productData.description,
      type: productData.type,
      category_id: productData.categoryId,
      specifications: productData.specifications as any,
      default_dimensions: productData.dimensionsParDefaut as any,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création du produit: ${error.message}`);
    }

    return this.mapRowToProduct(data);
  }

  // Mettre à jour un produit
  static async updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
    const updateData: ProductUpdate = {
      ...(updates.nom && { name: updates.nom }),
      ...(updates.description && { description: updates.description }),
      ...(updates.type && { type: updates.type }),
      ...(updates.categoryId && { category_id: updates.categoryId }),
      ...(updates.specifications && { specifications: updates.specifications as any }),
      ...(updates.dimensionsParDefaut && { default_dimensions: updates.dimensionsParDefaut as any }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la mise à jour du produit: ${error.message}`);
    }

    return this.mapRowToProduct(data);
  }

  // Supprimer un produit
  static async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erreur lors de la suppression du produit: ${error.message}`);
    }
  }

  // Rechercher des produits
  static async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,type.ilike.%${query}%`)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Erreur lors de la recherche de produits: ${error.message}`);
    }

    return data.map(this.mapRowToProduct);
  }

  // ==================== MAPPERS ====================

  // Mapper une ligne de base de données vers un objet ProductCategory
  private static mapRowToCategory(row: ProductCategoryRow): ProductCategory {
    return {
      id: row.id,
      nom: row.name,
      description: row.description || '',
      icon: 'package', // Valeur par défaut, peut être étendue plus tard
    };
  }

  // Mapper une ligne de base de données vers un objet Product
  private static mapRowToProduct(row: ProductRow): Product {
    const specifications = row.specifications as any || {};
    const defaultDimensions = row.default_dimensions as any || {};

    return {
      id: row.id,
      nom: row.name,
      categoryId: row.category_id,
      description: row.description,
      type: row.type as Product['type'],
      specifications: {
        materiaux: specifications.materiaux || [],
        couleurs: specifications.couleurs || [],
        typesVitrage: specifications.typesVitrage,
        systemeOuverture: specifications.systemeOuverture,
      },
      dimensionsParDefaut: {
        largeurMin: defaultDimensions.largeurMin || 0,
        largeurMax: defaultDimensions.largeurMax || 0,
        hauteurMin: defaultDimensions.hauteurMin || 0,
        hauteurMax: defaultDimensions.hauteurMax || 0,
      },
      createdAt: new Date(row.created_at || ''),
      updatedAt: new Date(row.updated_at || ''),
    };
  }
}
