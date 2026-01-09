/**
 * Configuration du client API pour PFEHub
 * Base URL et configuration Axios pour communiquer avec le backend Spring Boot
 */

// Configuration de base pour les appels API (Vite uses import.meta.env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

/**
 * Client API générique
 */
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Récupérer le token depuis localStorage si disponible
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Définir le token d'authentification
   */
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Supprimer le token d'authentification
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Headers par défaut pour les requêtes
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Méthode GET générique
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const url = new URL(`${this.baseURL}${endpoint}`);
      
      // Ajouter les paramètres de query si présents
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      throw this.processError(error);
    }
  }

  /**
   * Méthode POST générique
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      throw this.processError(error);
    }
  }

  /**
   * Méthode PUT générique
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      throw this.processError(error);
    }
  }

  /**
   * Méthode DELETE générique
   */
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      throw this.processError(error);
    }
  }

  /**
   * Upload de fichier (FormData)
   */
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    try {
      const headers: HeadersInit = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      throw this.processError(error);
    }
  }

  /**
   * Gestion des erreurs HTTP
   */
  private async handleError(response: Response): Promise<ApiError> {
    let errorMessage = 'Une erreur est survenue';
    let errors: Record<string, string[]> | undefined;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      errors = errorData.errors;
    } catch {
      // Si la réponse n'est pas du JSON, utiliser le message par défaut
      errorMessage = response.statusText || errorMessage;
    }

    return {
      message: errorMessage,
      status: response.status,
      errors,
    };
  }

  /**
   * Traitement des erreurs
   */
  private processError(error: any): ApiError {
    if (error.status) {
      return error as ApiError;
    }

    // Erreur réseau ou autre
    return {
      message: error.message || 'Erreur de connexion au serveur',
      status: 0,
    };
  }
}

// Instance singleton du client API
export const apiClient = new ApiClient(API_BASE_URL);

// Export des types
export type { ApiResponse, ApiError };
