/**
 * Services Supabase pour l'application Coteline Pro
 * 
 * Ce fichier exporte tous les services de données pour faciliter les imports
 * dans l'application React Native.
 */

export { ClientService } from './clientService';
export { ProductService } from './productService';
export { ProjectService } from './projectService';

// Types réexportés pour faciliter l'utilisation
export type {
  Client,
  Product,
  ProductCategory,
  Project,
  ProjectProduct,
  StatutProject,
  TypeProduct
} from '../types';

/**
 * Exemple d'utilisation:
 * 
 * ```typescript
 * import { ClientService, ProductService, ProjectService } from '@/services';
 * 
 * // Récupérer tous les clients
 * const clients = await ClientService.getAll();
 * 
 * // Récupérer les produits par catégorie
 * const produits = await ProductService.getProductsByCategory('category-id');
 * 
 * // Créer un nouveau projet
 * const projet = await ProjectService.createProject({
 *   nom: 'Nouveau projet',
 *   clientId: 'client-id',
 *   statut: 'brouillon'
 * });
 * ```
 */
