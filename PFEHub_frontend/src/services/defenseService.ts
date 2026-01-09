/**
 * Service de gestion des Soutenances (Defenses)
 * 
 * Workflow corrigé :
 * 1. L'étudiant soumet son PFE → L'entité PFE existe, mais PAS de Soutenance
 * 2. L'encadrant propose une soutenance → C'EST ICI que l'entité Soutenance est CRÉÉE
 * 3. L'admin valide/modifie/reporte → Modification de l'entité Soutenance existante
 * 4. Après soutenance → L'encadrant évalue
 */

import { apiClient } from './apiClient';
import type {
  Defense,
  DefenseProposal,
  DefenseValidation,
  DefenseModification,
  DefenseRejection,
  DefenseEvaluation,
  DefenseEvaluationSubmission,
  PaginatedResponse,
  PageRequest,
} from './types';

class DefenseService {
  private readonly endpoint = '/defenses';

  /**
   * ÉTAPE 6 : Proposer une soutenance (Encadrant)
   * 
   * C'est à ce moment que l'entité Soutenance est CRÉÉE dans la base de données.
   * Le projectId est passé dans la requête, et le backend :
   * 1. Crée une nouvelle instance de Soutenance
   * 2. Lie le projet à cette soutenance
   * 3. Remplit les informations (date, heure, salle)
   * 4. Crée les entités JuryMember
   * 5. Définit le statut à "PROPOSEE"
   * 6. Sauvegarde le tout
   * 
   * @param proposal - Les données de la proposition incluant le projectId
   * @returns La soutenance nouvellement créée
   */
  async proposeDefense(proposal: DefenseProposal): Promise<Defense> {
    try {
      const response = await apiClient.post<Defense>(`${this.endpoint}/propose`, proposal);
      return response;
    } catch (error) {
      console.error('Erreur lors de la proposition de soutenance:', error);
      throw error;
    }
  }

  /**
   * ÉTAPE 7 : Valider une proposition de soutenance (Admin)
   * 
   * L'admin valide la soutenance proposée par l'encadrant.
   * La soutenance existe déjà, on ne fait que modifier son statut et éventuellement ses détails.
   * 
   * @param validation - Les données de validation
   * @returns La soutenance validée
   */
  async validateDefense(validation: DefenseValidation): Promise<Defense> {
    try {
      const { defenseId, ...data } = validation;
      const response = await apiClient.put<Defense>(
        `${this.endpoint}/${defenseId}/validate`,
        data
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la validation de soutenance:', error);
      throw error;
    }
  }

  /**
   * ÉTAPE 7 : Modifier une proposition de soutenance (Admin)
   * 
   * L'admin modifie la date/heure/salle en cas de conflit.
   * La soutenance existe déjà, on met à jour ses informations.
   * 
   * @param modification - Les nouvelles données et la raison de modification
   * @returns La soutenance modifiée
   */
  async modifyDefense(modification: DefenseModification): Promise<Defense> {
    try {
      const { defenseId, ...data } = modification;
      const response = await apiClient.put<Defense>(
        `${this.endpoint}/${defenseId}/modify`,
        data
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la modification de soutenance:', error);
      throw error;
    }
  }

  /**
   * ÉTAPE 7 : Reporter une proposition de soutenance (Admin)
   * 
   * L'admin reporte la soutenance (conflit de disponibilité).
   * La soutenance existe toujours, mais son statut devient "REPORTEE".
   * 
   * @param rejection - L'ID de la soutenance et la raison du report
   * @returns La soutenance reportée
   */
  async rejectDefense(rejection: DefenseRejection): Promise<Defense> {
    try {
      const { defenseId, ...data } = rejection;
      const response = await apiClient.put<Defense>(
        `${this.endpoint}/${defenseId}/reject`,
        data
      );
      return response;
    } catch (error) {
      console.error('Erreur lors du report de soutenance:', error);
      throw error;
    }
  }

  /**
   * Récupérer toutes les soutenances avec filtres
   * 
   * @param filters - Filtres optionnels (statut, professorId, etc.)
   * @param pagination - Options de pagination
   * @returns Liste paginée des soutenances
   */
  async getDefenses(
    filters?: {
      status?: string;
      professorId?: number;
      studentId?: number;
      fromDate?: string;
      toDate?: string;
    },
    pagination?: PageRequest
  ): Promise<PaginatedResponse<Defense>> {
    try {
      const params = {
        ...filters,
        ...pagination,
      };
      
      const response = await apiClient.get<PaginatedResponse<Defense>>(
        this.endpoint,
        params
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des soutenances:', error);
      throw error;
    }
  }

  /**
   * Récupérer les propositions en attente de validation (pour Admin)
   * 
   * @returns Liste des soutenances avec statut PROPOSEE
   */
  async getPendingProposals(): Promise<Defense[]> {
    try {
      const response = await apiClient.get<Defense[]>(
        `${this.endpoint}/pending`
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des propositions:', error);
      throw error;
    }
  }

  /**
   * Récupérer les soutenances d'un professeur
   * 
   * @param professorId - ID du professeur
   * @returns Liste des soutenances du professeur
   */
  async getDefensesByProfessor(professorId: number): Promise<Defense[]> {
    try {
      const response = await apiClient.get<Defense[]>(
        `${this.endpoint}/professor/${professorId}`
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des soutenances du professeur:', error);
      throw error;
    }
  }

  /**
   * Récupérer la soutenance d'un étudiant
   * 
   * @param studentId - ID de l'étudiant
   * @returns La soutenance de l'étudiant (s'il en a une)
   */
  async getDefenseByStudent(studentId: number): Promise<Defense | null> {
    try {
      const response = await apiClient.get<Defense>(
        `${this.endpoint}/student/${studentId}`
      );
      return response;
    } catch (error: any) {
      if (error.status === 404) {
        return null; // L'étudiant n'a pas encore de soutenance
      }
      console.error('Erreur lors de la récupération de la soutenance de l\'étudiant:', error);
      throw error;
    }
  }

  /**
   * Récupérer une soutenance par son ID
   * 
   * @param defenseId - ID de la soutenance
   * @returns La soutenance
   */
  async getDefenseById(defenseId: number): Promise<Defense> {
    try {
      const response = await apiClient.get<Defense>(
        `${this.endpoint}/${defenseId}`
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de la soutenance:', error);
      throw error;
    }
  }

  /**
   * ÉTAPE 9 : Évaluer une soutenance (Encadrant/Président du jury)
   * 
   * Après la soutenance et la délibération (hors application), l'encadrant
   * saisit la note finale unique résultant de la délibération du jury.
   * 
   * @param evaluation - Les données d'évaluation incluant la note finale
   * @returns L'évaluation créée
   */
  async evaluateDefense(evaluation: DefenseEvaluationSubmission): Promise<DefenseEvaluation> {
    try {
      const { defenseId, ...data } = evaluation;
      const response = await apiClient.post<DefenseEvaluation>(
        `${this.endpoint}/${defenseId}/evaluate`,
        data
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'évaluation de la soutenance:', error);
      throw error;
    }
  }

  /**
   * Récupérer l'évaluation d'une soutenance
   * 
   * @param defenseId - ID de la soutenance
   * @returns L'évaluation de la soutenance
   */
  async getDefenseEvaluation(defenseId: number): Promise<DefenseEvaluation | null> {
    try {
      const response = await apiClient.get<DefenseEvaluation>(
        `${this.endpoint}/${defenseId}/evaluation`
      );
      return response;
    } catch (error: any) {
      if (error.status === 404) {
        return null; // Pas encore d'évaluation
      }
      console.error('Erreur lors de la récupération de l\'évaluation:', error);
      throw error;
    }
  }

  /**
   * Récupérer les soutenances à venir (prochaines 7 jours)
   * 
   * @returns Liste des soutenances à venir
   */
  async getUpcomingDefenses(): Promise<Defense[]> {
    try {
      const response = await apiClient.get<Defense[]>(
        `${this.endpoint}/upcoming`
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des soutenances à venir:', error);
      throw error;
    }
  }

  /**
   * Récupérer le calendrier complet des soutenances
   * 
   * @param month - Mois (1-12)
   * @param year - Année
   * @returns Soutenances du mois
   */
  async getDefenseCalendar(month: number, year: number): Promise<Defense[]> {
    try {
      const response = await apiClient.get<Defense[]>(
        `${this.endpoint}/calendar`,
        { month, year }
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération du calendrier:', error);
      throw error;
    }
  }

  /**
   * Vérifier les conflits de salle/horaire
   * 
   * @param date - Date de la soutenance
   * @param time - Heure de la soutenance
   * @param room - Salle
   * @returns true si conflit détecté
   */
  async checkConflicts(date: string, time: string, room: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ hasConflict: boolean }>(
        `${this.endpoint}/check-conflicts`,
        { date, time, room }
      );
      return response.hasConflict;
    } catch (error) {
      console.error('Erreur lors de la vérification des conflits:', error);
      throw error;
    }
  }
}

// Instance singleton du service
export const defenseService = new DefenseService();

// Export du type
export default DefenseService;
