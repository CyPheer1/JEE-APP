/**
 * Service de gestion des Projets (PFE)
 */

import { apiClient } from './apiClient';
import type {
  Project,
  ProjectSubmission,
  ProjectAssignment,
  AssignmentRecommendation,
  PaginatedResponse,
  PageRequest,
  Deliverable,
  DeliverableSubmission,
} from './types';

class ProjectService {
  private readonly endpoint = '/projects';

  /**
   * ÉTAPE 1 : Soumettre un nouveau projet (Étudiant)
   * 
   * @param submission - Les données du projet + fichier PDF
   * @returns Le projet créé
   */
  async submitProject(submission: ProjectSubmission): Promise<Project> {
    try {
      // Créer un FormData pour envoyer le fichier
      const formData = new FormData();
      formData.append('title', submission.title);
      formData.append('description', submission.description);
      formData.append('objectives', submission.objectives);
      
      if (submission.context) {
        formData.append('context', submission.context);
      }
      if (submission.methodology) {
        formData.append('methodology', submission.methodology);
      }
      if (submission.expectedResults) {
        formData.append('expectedResults', submission.expectedResults);
      }
      if (submission.keywords) {
        formData.append('keywords', JSON.stringify(submission.keywords));
      }
      
      formData.append('proposalFile', submission.proposalFile);

      const response = await apiClient.upload<Project>(
        `${this.endpoint}/submit`,
        formData
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la soumission du projet:', error);
      throw error;
    }
  }

  /**
   * ÉTAPE 3 : Accepter un projet (Encadrant)
   * 
   * @param projectId - ID du projet
   * @param comments - Commentaires optionnels
   * @returns Le projet accepté
   */
  async acceptProject(projectId: number, comments?: string): Promise<Project> {
    try {
      const response = await apiClient.put<Project>(
        `${this.endpoint}/${projectId}/accept`,
        { comments }
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'acceptation du projet:', error);
      throw error;
    }
  }

  /**
   * ÉTAPE 3 : Refuser un projet (Encadrant)
   * 
   * @param projectId - ID du projet
   * @param reason - Raison du refus
   * @param comments - Commentaires détaillés
   * @returns Le projet refusé
   */
  async rejectProject(
    projectId: number,
    reason: string,
    comments?: string
  ): Promise<Project> {
    try {
      const response = await apiClient.put<Project>(
        `${this.endpoint}/${projectId}/reject`,
        { reason, comments }
      );
      return response;
    } catch (error) {
      console.error('Erreur lors du refus du projet:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les projets avec filtres
   * 
   * @param filters - Filtres optionnels
   * @param pagination - Options de pagination
   * @returns Liste paginée des projets
   */
  async getProjects(
    filters?: {
      status?: string;
      professorId?: number;
      studentId?: number;
      departmentId?: number;
      specializationId?: number;
    },
    pagination?: PageRequest
  ): Promise<PaginatedResponse<Project>> {
    try {
      const params = {
        ...filters,
        ...pagination,
      };
      
      const response = await apiClient.get<PaginatedResponse<Project>>(
        this.endpoint,
        params
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw error;
    }
  }

  /**
   * Récupérer un projet par son ID
   * 
   * @param projectId - ID du projet
   * @returns Le projet
   */
  async getProjectById(projectId: number): Promise<Project> {
    try {
      const response = await apiClient.get<Project>(
        `${this.endpoint}/${projectId}`
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération du projet:', error);
      throw error;
    }
  }

  /**
   * Récupérer le projet d'un étudiant
   * 
   * @param studentId - ID de l'étudiant
   * @returns Le projet de l'étudiant
   */
  async getProjectByStudent(studentId: number): Promise<Project | null> {
    try {
      const response = await apiClient.get<Project>(
        `${this.endpoint}/student/${studentId}`
      );
      return response;
    } catch (error: any) {
      if (error.status === 404) {
        return null; // L'étudiant n'a pas encore de projet
      }
      console.error('Erreur lors de la récupération du projet de l\'étudiant:', error);
      throw error;
    }
  }

  /**
   * Récupérer les projets d'un professeur
   * 
   * @param professorId - ID du professeur
   * @returns Liste des projets du professeur
   */
  async getProjectsByProfessor(professorId: number): Promise<Project[]> {
    try {
      const response = await apiClient.get<Project[]>(
        `${this.endpoint}/professor/${professorId}`
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des projets du professeur:', error);
      throw error;
    }
  }

  /**
   * ÉTAPE 2 : Récupérer les projets en attente d'assignation (Admin)
   * 
   * @returns Liste des projets non assignés
   */
  async getPendingAssignments(): Promise<Project[]> {
    try {
      const response = await apiClient.get<Project[]>(
        `${this.endpoint}/pending-assignments`
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des projets en attente:', error);
      throw error;
    }
  }

  /**
   * ÉTAPE 2 : Obtenir des recommandations d'encadrants (Admin)
   * 
   * @param projectId - ID du projet
   * @returns Liste des recommandations avec score de correspondance
   */
  async getAssignmentRecommendations(
    projectId: number
  ): Promise<AssignmentRecommendation[]> {
    try {
      const response = await apiClient.get<AssignmentRecommendation[]>(
        `${this.endpoint}/${projectId}/recommendations`
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error);
      throw error;
    }
  }

  /**
   * ÉTAPE 2 : Assigner un encadrant à un projet (Admin)
   * 
   * @param assignment - Données d'assignation
   * @returns Le projet assigné
   */
  async assignProfessor(assignment: ProjectAssignment): Promise<Project> {
    try {
      const { projectId, ...data } = assignment;
      const response = await apiClient.post<Project>(
        `${this.endpoint}/${projectId}/assign`,
        data
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'assignation du professeur:', error);
      throw error;
    }
  }

  /**
   * ÉTAPE 5 : Marquer le projet comme soumission finale (Étudiant)
   * 
   * @param projectId - ID du projet
   * @param finalReport - Fichier du rapport final
   * @returns Le projet avec statut SOUMISSION_FINALE
   */
  async submitFinalReport(projectId: number, finalReport: File): Promise<Project> {
    try {
      const formData = new FormData();
      formData.append('finalReport', finalReport);

      const response = await apiClient.upload<Project>(
        `${this.endpoint}/${projectId}/final-submission`,
        formData
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la soumission finale:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un projet
   * 
   * @param projectId - ID du projet
   * @param updates - Champs à mettre à jour
   * @returns Le projet mis à jour
   */
  async updateProject(
    projectId: number,
    updates: Partial<ProjectSubmission>
  ): Promise<Project> {
    try {
      const response = await apiClient.put<Project>(
        `${this.endpoint}/${projectId}`,
        updates
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      throw error;
    }
  }

  /**
   * Récupérer les projets éligibles pour soutenance
   * (Statut SOUMISSION_FINALE pour un professeur donné)
   * 
   * @param professorId - ID du professeur
   * @returns Liste des projets prêts pour soutenance
   */
  async getProjectsReadyForDefense(professorId: number): Promise<Project[]> {
    try {
      const response = await apiClient.get<Project[]>(
        `${this.endpoint}/ready-for-defense`,
        { professorId }
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des projets prêts pour soutenance:', error);
      throw error;
    }
  }

  // ============= DELIVERABLES =============

  /**
   * ÉTAPE 4 : Soumettre un livrable (Étudiant)
   * 
   * @param submission - Données du livrable + fichier
   * @returns Le livrable créé
   */
  async submitDeliverable(submission: DeliverableSubmission): Promise<Deliverable> {
    try {
      const formData = new FormData();
      formData.append('projectId', String(submission.projectId));
      formData.append('title', submission.title);
      formData.append('description', submission.description);
      formData.append('type', submission.type);
      formData.append('file', submission.file);
      
      if (submission.notes) {
        formData.append('notes', submission.notes);
      }

      const response = await apiClient.upload<Deliverable>(
        `${this.endpoint}/deliverables`,
        formData
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la soumission du livrable:', error);
      throw error;
    }
  }

  /**
   * Récupérer les livrables d'un projet
   * 
   * @param projectId - ID du projet
   * @returns Liste des livrables
   */
  async getDeliverables(projectId: number): Promise<Deliverable[]> {
    try {
      const response = await apiClient.get<Deliverable[]>(
        `${this.endpoint}/${projectId}/deliverables`
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des livrables:', error);
      throw error;
    }
  }

  /**
   * Télécharger un fichier de projet
   * 
   * @param fileUrl - URL du fichier
   * @returns Blob du fichier
   */
  async downloadFile(fileUrl: string): Promise<Blob> {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du fichier');
      }
      return await response.blob();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      throw error;
    }
  }
}

// Instance singleton du service
export const projectService = new ProjectService();

// Export du type
export default ProjectService;
