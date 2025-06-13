import { supabase } from "../lib/supabase";
import { Database } from "../types/database";
import { Project, ProjectProduct, Client, Product } from "../types";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

type ProjectProductInsert =
  Database["public"]["Tables"]["project_products"]["Insert"];

export class ProjectService {
  // ==================== GESTION DES PROJETS ====================

  // Récupérer tous les projets
  static async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        clients (
          id, first_name, last_name, email, phone, company,
          address_street, address_city, address_postal_code, address_country,
          created_at, updated_at
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Erreur lors de la récupération des projets: ${error.message}`
      );
    }

    return Promise.all(
      data.map(async (row) => {
        const projectProducts = await ProjectService.getProjectProducts(row.id);
        return ProjectService.mapRowToProject(row, projectProducts);
      })
    );
  }

  // Récupérer les projets d'un client
  static async getProjectsByClient(clientId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        clients (
          id, first_name, last_name, email, phone, company,
          address_street, address_city, address_postal_code, address_country,
          created_at, updated_at
        )
      `
      )
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Erreur lors de la récupération des projets du client: ${error.message}`
      );
    }

    return Promise.all(
      data.map(async (row) => {
        const projectProducts = await ProjectService.getProjectProducts(row.id);
        return ProjectService.mapRowToProject(row, projectProducts);
      })
    );
  }

  // Récupérer un projet par ID
  static async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        clients (
          id, first_name, last_name, email, phone, company,
          address_street, address_city, address_postal_code, address_country,
          created_at, updated_at
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Projet non trouvé
      }
      throw new Error(
        `Erreur lors de la récupération du projet: ${error.message}`
      );
    }

    const projectProducts = await ProjectService.getProjectProducts(id);
    return ProjectService.mapRowToProject(data, projectProducts);
  }

  // Créer un nouveau projet
  static async createProject(
    projectData: Omit<
      Project,
      "id" | "client" | "produits" | "createdAt" | "updatedAt"
    >
  ): Promise<Project> {
    const insertData: ProjectInsert = {
      name: projectData.nom,
      description: projectData.description || null,
      client_id: projectData.clientId,
      status: ProjectService.mapStatusToDb(projectData.statut),
      site_address_street: projectData.adresseChantier?.rue || null,
      site_address_city: projectData.adresseChantier?.ville || null,
      site_address_postal_code: projectData.adresseChantier?.codePostal || null,
      planned_start_date:
        projectData.dateDebutPrevue?.toISOString().split("T")[0] || null,
      planned_end_date:
        projectData.dateFinPrevue?.toISOString().split("T")[0] || null,
      notes: projectData.notes || null,
      tags: projectData.tags || null,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(insertData)
      .select(
        `
        *,
        clients (
          id, first_name, last_name, email, phone, company,
          address_street, address_city, address_postal_code, address_country,
          created_at, updated_at
        )
      `
      )
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création du projet: ${error.message}`);
    }

    return ProjectService.mapRowToProject(data, []);
  }

  // Mettre à jour un projet
  static async updateProject(
    id: string,
    updates: Partial<
      Omit<Project, "id" | "client" | "produits" | "createdAt" | "updatedAt">
    >
  ): Promise<Project> {
    const updateData: ProjectUpdate = {
      ...(updates.nom && { name: updates.nom }),
      ...(updates.description !== undefined && {
        description: updates.description || null,
      }),
      ...(updates.clientId && { client_id: updates.clientId }),
      ...(updates.statut && {
        status: ProjectService.mapStatusToDb(updates.statut),
      }),
      ...(updates.adresseChantier && {
        site_address_street: updates.adresseChantier.rue,
        site_address_city: updates.adresseChantier.ville,
        site_address_postal_code: updates.adresseChantier.codePostal,
      }),
      ...(updates.dateDebutPrevue !== undefined && {
        planned_start_date:
          updates.dateDebutPrevue?.toISOString().split("T")[0] || null,
      }),
      ...(updates.dateFinPrevue !== undefined && {
        planned_end_date:
          updates.dateFinPrevue?.toISOString().split("T")[0] || null,
      }),
      ...(updates.notes !== undefined && { notes: updates.notes || null }),
      ...(updates.tags !== undefined && { tags: updates.tags || null }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        clients (
          id, first_name, last_name, email, phone, company,
          address_street, address_city, address_postal_code, address_country,
          created_at, updated_at
        )
      `
      )
      .single();

    if (error) {
      throw new Error(
        `Erreur lors de la mise à jour du projet: ${error.message}`
      );
    }

    const projectProducts = await ProjectService.getProjectProducts(id);
    return ProjectService.mapRowToProject(data, projectProducts);
  }

  // Supprimer un projet
  static async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      throw new Error(
        `Erreur lors de la suppression du projet: ${error.message}`
      );
    }
  }

  // Rechercher des projets
  static async searchProjects(query: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        clients (
          id, first_name, last_name, email, phone, company,
          address_street, address_city, address_postal_code, address_country,
          created_at, updated_at
        )
      `
      )
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%,notes.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Erreur lors de la recherche de projets: ${error.message}`
      );
    }

    return Promise.all(
      data.map(async (row) => {
        const projectProducts = await ProjectService.getProjectProducts(row.id);
        return ProjectService.mapRowToProject(row, projectProducts);
      })
    );
  }

  // ==================== GESTION DES PRODUITS DE PROJET ====================

  // Récupérer les produits d'un projet
  static async getProjectProducts(
    projectId: string
  ): Promise<ProjectProduct[]> {
    const { data, error } = await supabase
      .from("project_products")
      .select(
        `
        *,
        products (
          id, name, description, type, category_id, specifications, default_dimensions,
          created_at, updated_at
        )
      `
      )
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(
        `Erreur lors de la récupération des produits du projet: ${error.message}`
      );
    }

    return data.map(ProjectService.mapRowToProjectProduct);
  }

  // Ajouter un produit à un projet
  static async addProductToProject(
    projectProductData: Omit<
      ProjectProduct,
      "id" | "product" | "createdAt" | "updatedAt"
    >
  ): Promise<ProjectProduct> {
    const insertData: ProjectProductInsert = {
      project_id: projectProductData.projectId,
      product_id: projectProductData.productId,
      quantity: projectProductData.quantite,
      dimensions: projectProductData.dimensions as any,
      parameters: projectProductData.parametres as any,
      status: ProjectService.mapProjectProductStatusToDb(
        projectProductData.statut
      ),
      notes: projectProductData.notes || null,
    };

    const { data, error } = await supabase
      .from("project_products")
      .insert(insertData)
      .select(
        `
        *,
        products (
          id, name, description, type, category_id, specifications, default_dimensions,
          created_at, updated_at
        )
      `
      )
      .single();

    if (error) {
      throw new Error(
        `Erreur lors de l'ajout du produit au projet: ${error.message}`
      );
    }

    return ProjectService.mapRowToProjectProduct(data);
  }

  // ==================== MAPPERS ET UTILITAIRES ====================

  // Mapper le statut vers la base de données
  private static mapStatusToDb(status: Project["statut"]): string {
    const statusMap = {
      brouillon: "draft",
      en_cours: "in_progress",
      termine: "completed",
      annule: "cancelled",
    };
    return statusMap[status] || "draft";
  }

  // Mapper le statut depuis la base de données
  private static mapStatusFromDb(status: string): Project["statut"] {
    const statusMap: Record<string, Project["statut"]> = {
      draft: "brouillon",
      in_progress: "en_cours",
      completed: "termine",
      cancelled: "annule",
    };
    return statusMap[status] || "brouillon";
  }

  // Mapper le statut de produit projet vers la base de données
  private static mapProjectProductStatusToDb(
    status: ProjectProduct["statut"]
  ): string {
    const statusMap = {
      brouillon: "draft",
      valide: "validated",
      commande: "ordered",
    };
    return statusMap[status] || "draft";
  }

  // Mapper le statut de produit projet depuis la base de données
  private static mapProjectProductStatusFromDb(
    status: string
  ): ProjectProduct["statut"] {
    const statusMap: Record<string, ProjectProduct["statut"]> = {
      draft: "brouillon",
      validated: "valide",
      ordered: "commande",
    };
    return statusMap[status] || "brouillon";
  }

  // Mapper une ligne de base de données vers un objet Project
  private static mapRowToProject(
    row: any,
    projectProducts: ProjectProduct[]
  ): Project {
    const client: Client = {
      id: row.clients.id,
      nom: row.clients.last_name,
      prenom: row.clients.first_name,
      email: row.clients.email,
      telephone: row.clients.phone,
      entreprise: row.clients.company || undefined,
      adresse: {
        rue: row.clients.address_street,
        ville: row.clients.address_city,
        codePostal: row.clients.address_postal_code,
        pays: row.clients.address_country || "France",
      },
      projets: [], // Sera peuplé séparément si nécessaire
      createdAt: new Date(row.clients.created_at),
      updatedAt: new Date(row.clients.updated_at),
    };

    return {
      id: row.id,
      nom: row.name,
      description: row.description || undefined,
      clientId: row.client_id,
      client,
      produits: projectProducts,
      statut: ProjectService.mapStatusFromDb(row.status || "draft"),
      adresseChantier: row.site_address_street
        ? {
            rue: row.site_address_street,
            ville: row.site_address_city || "",
            codePostal: row.site_address_postal_code || "",
            pays: "France",
          }
        : undefined,
      dateDebutPrevue: row.planned_start_date
        ? new Date(row.planned_start_date)
        : undefined,
      dateFinPrevue: row.planned_end_date
        ? new Date(row.planned_end_date)
        : undefined,
      notes: row.notes || undefined,
      tags: row.tags || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  // Mapper une ligne de base de données vers un objet ProjectProduct
  private static mapRowToProjectProduct(row: any): ProjectProduct {
    const product: Product = {
      id: row.products.id,
      nom: row.products.name,
      categoryId: row.products.category_id,
      description: row.products.description,
      type: row.products.type,
      specifications: row.products.specifications || {
        materiaux: [],
        couleurs: [],
      },
      dimensionsParDefaut: row.products.default_dimensions || {
        largeurMin: 0,
        largeurMax: 0,
        hauteurMin: 0,
        hauteurMax: 0,
      },
      createdAt: new Date(row.products.created_at),
      updatedAt: new Date(row.products.updated_at),
    };

    return {
      id: row.id,
      productId: row.product_id,
      projectId: row.project_id,
      product,
      quantite: row.quantity || 1,
      dimensions: row.dimensions || { largeur: 0, hauteur: 0 },
      parametres: row.parameters || { materiau: "", couleur: "" },
      notes: row.notes || undefined,
      statut: ProjectService.mapProjectProductStatusFromDb(
        row.status || "draft"
      ),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
