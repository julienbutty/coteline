/**
 * Simple Event Emitter pour notifier les changements de données
 * Permet de synchroniser les différents écrans sans state management complexe
 */

type EventCallback = (...args: any[]) => void;

class EventEmitter {
  private events: { [key: string]: EventCallback[] } = {};

  // S'abonner à un événement
  on(event: string, callback: EventCallback): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // Retourner une fonction de désabonnement
    return () => {
      this.off(event, callback);
    };
  }

  // Se désabonner d'un événement
  off(event: string, callback: EventCallback): void {
    if (!this.events[event]) return;
    
    const index = this.events[event].indexOf(callback);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  // Émettre un événement
  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Erreur dans l'événement ${event}:`, error);
      }
    });
  }

  // Supprimer tous les listeners d'un événement
  removeAllListeners(event?: string): void {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

// Instance globale
export const eventEmitter = new EventEmitter();

// Événements prédéfinis pour l'application
export const EVENTS = {
  // Clients
  CLIENT_CREATED: 'client:created',
  CLIENT_UPDATED: 'client:updated',
  CLIENT_DELETED: 'client:deleted',
  CLIENTS_REFRESH: 'clients:refresh',
  
  // Projets
  PROJECT_CREATED: 'project:created',
  PROJECT_UPDATED: 'project:updated',
  PROJECT_DELETED: 'project:deleted',
  PROJECTS_REFRESH: 'projects:refresh',
  
  // Produits
  PRODUCT_CREATED: 'product:created',
  PRODUCT_UPDATED: 'product:updated',
  PRODUCT_DELETED: 'product:deleted',
  PRODUCTS_REFRESH: 'products:refresh',
} as const;

// Types pour TypeScript
export type EventType = typeof EVENTS[keyof typeof EVENTS];

// Helpers pour les événements spécifiques
export const clientEvents = {
  created: (client: any) => eventEmitter.emit(EVENTS.CLIENT_CREATED, client),
  updated: (client: any) => eventEmitter.emit(EVENTS.CLIENT_UPDATED, client),
  deleted: (clientId: string) => eventEmitter.emit(EVENTS.CLIENT_DELETED, clientId),
  refresh: () => eventEmitter.emit(EVENTS.CLIENTS_REFRESH),
};

export const projectEvents = {
  created: (project: any) => eventEmitter.emit(EVENTS.PROJECT_CREATED, project),
  updated: (project: any) => eventEmitter.emit(EVENTS.PROJECT_UPDATED, project),
  deleted: (projectId: string) => eventEmitter.emit(EVENTS.PROJECT_DELETED, projectId),
  refresh: () => eventEmitter.emit(EVENTS.PROJECTS_REFRESH),
};

export const productEvents = {
  created: (product: any) => eventEmitter.emit(EVENTS.PRODUCT_CREATED, product),
  updated: (product: any) => eventEmitter.emit(EVENTS.PRODUCT_UPDATED, product),
  deleted: (productId: string) => eventEmitter.emit(EVENTS.PRODUCT_DELETED, productId),
  refresh: () => eventEmitter.emit(EVENTS.PRODUCTS_REFRESH),
};
