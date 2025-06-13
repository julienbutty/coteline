import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { Client } from '../types';

type ClientRow = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export class ClientService {
  // Récupérer tous les clients
  static async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des clients: ${error.message}`);
    }

    return data.map(this.mapRowToClient);
  }

  // Récupérer un client par ID
  static async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Client non trouvé
      }
      throw new Error(`Erreur lors de la récupération du client: ${error.message}`);
    }

    return this.mapRowToClient(data);
  }

  // Créer un nouveau client
  static async create(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'projets'>): Promise<Client> {
    const insertData: ClientInsert = {
      first_name: clientData.prenom || '',
      last_name: clientData.nom,
      email: clientData.email,
      phone: clientData.telephone,
      company: clientData.entreprise || null,
      address_street: clientData.adresse.rue,
      address_city: clientData.adresse.ville,
      address_postal_code: clientData.adresse.codePostal,
      address_country: clientData.adresse.pays,
    };

    const { data, error } = await supabase
      .from('clients')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création du client: ${error.message}`);
    }

    return this.mapRowToClient(data);
  }

  // Mettre à jour un client
  static async update(id: string, updates: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'projets'>>): Promise<Client> {
    const updateData: ClientUpdate = {
      ...(updates.nom && { last_name: updates.nom }),
      ...(updates.prenom && { first_name: updates.prenom }),
      ...(updates.email && { email: updates.email }),
      ...(updates.telephone && { phone: updates.telephone }),
      ...(updates.entreprise !== undefined && { company: updates.entreprise || null }),
      ...(updates.adresse && {
        address_street: updates.adresse.rue,
        address_city: updates.adresse.ville,
        address_postal_code: updates.adresse.codePostal,
        address_country: updates.adresse.pays,
      }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur lors de la mise à jour du client: ${error.message}`);
    }

    return this.mapRowToClient(data);
  }

  // Supprimer un client
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erreur lors de la suppression du client: ${error.message}`);
    }
  }

  // Rechercher des clients
  static async search(query: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`last_name.ilike.%${query}%,first_name.ilike.%${query}%,company.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la recherche de clients: ${error.message}`);
    }

    return data.map(this.mapRowToClient);
  }

  // Mapper une ligne de base de données vers un objet Client
  private static mapRowToClient(row: ClientRow): Client {
    return {
      id: row.id,
      nom: row.last_name,
      prenom: row.first_name,
      email: row.email,
      telephone: row.phone,
      entreprise: row.company || undefined,
      adresse: {
        rue: row.address_street,
        ville: row.address_city,
        codePostal: row.address_postal_code,
        pays: row.address_country,
      },
      projets: [], // Sera peuplé séparément si nécessaire
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
} 