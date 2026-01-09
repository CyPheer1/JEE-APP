/**
 * Hook React personnalisé pour la gestion des soutenances
 * 
 * Fournit des fonctions et un état réactif pour :
 * - Proposer des soutenances (Professeur)
 * - Valider/Modifier/Reporter des soutenances (Admin)
 * - Récupérer les soutenances
 * - Évaluer les soutenances (Professeur)
 */

import { useState, useCallback } from 'react';
import { defenseService } from '../services';
import type {
  Defense,
  DefenseProposal,
  DefenseValidation,
  DefenseModification,
  DefenseRejection,
  DefenseEvaluationSubmission,
  DefenseEvaluation,
} from '../services/types';

interface UseDefenseState {
  defenses: Defense[];
  currentDefense: Defense | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export function useDefense() {
  const [state, setState] = useState<UseDefenseState>({
    defenses: [],
    currentDefense: null,
    loading: false,
    error: null,
    success: null,
  });

  /**
   * Réinitialiser les messages d'erreur et de succès
   */
  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, success: null }));
  }, []);

  /**
   * ÉTAPE 6 : Proposer une soutenance (Professeur)
   */
  const proposeDefense = useCallback(async (proposal: DefenseProposal) => {
    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const defense = await defenseService.proposeDefense(proposal);
      setState((prev) => ({
        ...prev,
        loading: false,
        success: 'Proposition de soutenance envoyée avec succès !',
        defenses: [...prev.defenses, defense],
      }));
      return defense;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la proposition de soutenance',
      }));
      throw error;
    }
  }, []);

  /**
   * ÉTAPE 7 : Valider une soutenance (Admin)
   */
  const validateDefense = useCallback(async (validation: DefenseValidation) => {
    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const defense = await defenseService.validateDefense(validation);
      setState((prev) => ({
        ...prev,
        loading: false,
        success: 'Soutenance validée avec succès !',
        defenses: prev.defenses.map((d) => 
          d.id === defense.id ? defense : d
        ),
      }));
      return defense;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la validation de la soutenance',
      }));
      throw error;
    }
  }, []);

  /**
   * ÉTAPE 7 : Modifier une soutenance (Admin)
   */
  const modifyDefense = useCallback(async (modification: DefenseModification) => {
    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const defense = await defenseService.modifyDefense(modification);
      setState((prev) => ({
        ...prev,
        loading: false,
        success: 'Soutenance modifiée avec succès !',
        defenses: prev.defenses.map((d) => 
          d.id === defense.id ? defense : d
        ),
      }));
      return defense;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la modification de la soutenance',
      }));
      throw error;
    }
  }, []);

  /**
   * ÉTAPE 7 : Reporter une soutenance (Admin)
   */
  const rejectDefense = useCallback(async (rejection: DefenseRejection) => {
    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const defense = await defenseService.rejectDefense(rejection);
      setState((prev) => ({
        ...prev,
        loading: false,
        success: 'Soutenance reportée',
        defenses: prev.defenses.map((d) => 
          d.id === defense.id ? defense : d
        ),
      }));
      return defense;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors du report de la soutenance',
      }));
      throw error;
    }
  }, []);

  /**
   * Récupérer les propositions en attente (Admin)
   */
  const fetchPendingProposals = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const defenses = await defenseService.getPendingProposals();
      setState((prev) => ({
        ...prev,
        loading: false,
        defenses,
      }));
      return defenses;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération des propositions',
      }));
      throw error;
    }
  }, []);

  /**
   * Récupérer les soutenances d'un professeur
   */
  const fetchProfessorDefenses = useCallback(async (professorId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const defenses = await defenseService.getDefensesByProfessor(professorId);
      setState((prev) => ({
        ...prev,
        loading: false,
        defenses,
      }));
      return defenses;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération des soutenances',
      }));
      throw error;
    }
  }, []);

  /**
   * Récupérer la soutenance d'un étudiant
   */
  const fetchStudentDefense = useCallback(async (studentId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const defense = await defenseService.getDefenseByStudent(studentId);
      setState((prev) => ({
        ...prev,
        loading: false,
        currentDefense: defense,
      }));
      return defense;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération de la soutenance',
      }));
      throw error;
    }
  }, []);

  /**
   * Récupérer une soutenance par ID
   */
  const fetchDefenseById = useCallback(async (defenseId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const defense = await defenseService.getDefenseById(defenseId);
      setState((prev) => ({
        ...prev,
        loading: false,
        currentDefense: defense,
      }));
      return defense;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération de la soutenance',
      }));
      throw error;
    }
  }, []);

  /**
   * ÉTAPE 9 : Évaluer une soutenance (Professeur)
   */
  const evaluateDefense = useCallback(async (evaluation: DefenseEvaluationSubmission) => {
    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const result = await defenseService.evaluateDefense(evaluation);
      setState((prev) => ({
        ...prev,
        loading: false,
        success: 'Évaluation enregistrée avec succès !',
      }));
      return result;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de l\'évaluation de la soutenance',
      }));
      throw error;
    }
  }, []);

  /**
   * Récupérer l'évaluation d'une soutenance
   */
  const fetchDefenseEvaluation = useCallback(async (defenseId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const evaluation = await defenseService.getDefenseEvaluation(defenseId);
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
      return evaluation;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération de l\'évaluation',
      }));
      throw error;
    }
  }, []);

  /**
   * Récupérer les soutenances à venir
   */
  const fetchUpcomingDefenses = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const defenses = await defenseService.getUpcomingDefenses();
      setState((prev) => ({
        ...prev,
        loading: false,
        defenses,
      }));
      return defenses;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération des soutenances à venir',
      }));
      throw error;
    }
  }, []);

  /**
   * Vérifier les conflits de salle/horaire
   */
  const checkConflicts = useCallback(async (
    date: string,
    time: string,
    room: string
  ) => {
    try {
      const hasConflict = await defenseService.checkConflicts(date, time, room);
      return hasConflict;
    } catch (error: any) {
      console.error('Erreur lors de la vérification des conflits:', error);
      return false;
    }
  }, []);

  return {
    // État
    ...state,
    
    // Actions
    proposeDefense,
    validateDefense,
    modifyDefense,
    rejectDefense,
    evaluateDefense,
    
    // Récupération de données
    fetchPendingProposals,
    fetchProfessorDefenses,
    fetchStudentDefense,
    fetchDefenseById,
    fetchDefenseEvaluation,
    fetchUpcomingDefenses,
    checkConflicts,
    
    // Utilitaires
    clearMessages,
  };
}
