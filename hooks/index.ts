/**
 * Hooks personnalisés pour l'application Coteline Pro
 * 
 * Ce fichier exporte tous les hooks Supabase pour faciliter les imports
 * dans les composants React Native.
 */

export {
  useClients,
  useClient,
  useProducts,
  useProductCategories,
  useProduct,
  useProjects,
  useProject,
  useProjectsByClient
} from './useSupabase';

/**
 * Exemple d'utilisation:
 * 
 * ```typescript
 * import { useClients, useProducts, useProjects } from '@/hooks';
 * 
 * function MyComponent() {
 *   const { data: clients, loading, error, refetch } = useClients();
 *   
 *   if (loading) return <LoadingState loading={true} error={null} />;
 *   if (error) return <LoadingState loading={false} error={error} onRetry={refetch} />;
 *   
 *   return (
 *     <View>
 *       {clients.map(client => (
 *         <Text key={client.id}>{client.nom}</Text>
 *       ))}
 *     </View>
 *   );
 * }
 * ```
 */
