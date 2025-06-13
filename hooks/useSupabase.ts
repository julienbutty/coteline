import { useState, useEffect, useCallback } from 'react';
import { ClientService, ProductService, ProjectService } from '../services';
import type { Client, Product, ProductCategory, Project, ProjectProduct } from '../types';

// Types pour les états de chargement
interface LoadingState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface LoadingStateArray<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ==================== HOOKS CLIENTS ====================

export function useClients(): LoadingStateArray<Client> {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const clients = await ClientService.getAll();
      setData(clients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des clients');
      console.error('Erreur useClients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { data, loading, error, refetch: fetchClients };
}

export function useClient(id: string): LoadingState<Client> {
  const [data, setData] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const client = await ClientService.getById(id);
      setData(client);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du client');
      console.error('Erreur useClient:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return { data, loading, error, refetch: fetchClient };
}

// ==================== HOOKS PRODUITS ====================

export function useProducts(): LoadingStateArray<Product> {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await ProductService.getAllProducts();
      setData(products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
      console.error('Erreur useProducts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { data, loading, error, refetch: fetchProducts };
}

export function useProductCategories(): LoadingStateArray<ProductCategory> {
  const [data, setData] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const categories = await ProductService.getAllCategories();
      setData(categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des catégories');
      console.error('Erreur useProductCategories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { data, loading, error, refetch: fetchCategories };
}

export function useProduct(id: string): LoadingState<Product> {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const product = await ProductService.getProductById(id);
      setData(product);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du produit');
      console.error('Erreur useProduct:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { data, loading, error, refetch: fetchProduct };
}

// ==================== HOOKS PROJETS ====================

export function useProjects(): LoadingStateArray<Project> {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const projects = await ProjectService.getAllProjects();
      setData(projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des projets');
      console.error('Erreur useProjects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { data, loading, error, refetch: fetchProjects };
}

export function useProject(id: string): LoadingState<Project> {
  const [data, setData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const project = await ProjectService.getProjectById(id);
      setData(project);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du projet');
      console.error('Erreur useProject:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { data, loading, error, refetch: fetchProject };
}

export function useProjectsByClient(clientId: string): LoadingStateArray<Project> {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectsByClient = useCallback(async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
      setError(null);
      const projects = await ProjectService.getProjectsByClient(clientId);
      setData(projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des projets du client');
      console.error('Erreur useProjectsByClient:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchProjectsByClient();
  }, [fetchProjectsByClient]);

  return { data, loading, error, refetch: fetchProjectsByClient };
}
