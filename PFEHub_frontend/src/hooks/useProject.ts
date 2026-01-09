/**
 * Hook React personnalisé pour la gestion des projets
 * 
 * Fournit des fonctions et un état réactif pour :
 * - Soumettre des projets (Étudiant)
 * - Accepter/Refuser des projets (Professeur)
 * - Assigner des encadrants (Admin)
 * - Soumettre des livrables (Étudiant)
 */

import { useState, useCallback } from 'react';
import { projectService } from '../services';
import type {
  Project,
  ProjectSubmission,
  ProjectAssignment,
  AssignmentRecommendation,
  Deliverable,
  DeliverableSubmission,
} from '../services/types';

interface UseProjectState {
  projects: Project[];
  currentProject: Project | null;
  deliverables: Deliverable[];
  recommendations: AssignmentRecommendation[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

export function useProject() {
  const [state, setState] = useState<UseProjectState>({
    projects: [],
    currentProject: null,
    deliverables: [],
    recommendations: [],
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
   * ÉTAPE 1 : Soumettre un projet (Étudiant)
   */
  const submitProject = useCallback(async (submission: ProjectSubmission) => {
    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const project = await projectService.submitProject(submission);
      setState((prev) => ({
        ...prev,
        loading: false,
        success: 'Projet soumis avec succès !',
        currentProject: project,
      }));
      return project;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la soumission du projet',
      }));
      throw error;
    }
  }, []);

  /**
   * ÉTAPE 3 : Accepter un projet (Professeur)
   */
  const acceptProject = useCallback(async (projectId: number, comments?: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const project = await projectService.acceptProject(projectId, comments);
      setState((prev) => ({
        ...prev,
        loading: false,
        success: 'Projet accepté avec succès !',
        projects: prev.projects.map((p) => (p.id === project.id ? project : p)),
        currentProject: prev.currentProject?.id === project.id ? project : prev.currentProject,
      }));
      return project;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de l\'acceptation du projet',
      }));
      throw error;
    }
  }, []);

  /**
   * ÉTAPE 3 : Refuser un projet (Professeur)
   */
  const rejectProject = useCallback(async (
    projectId: number,
    reason: string,
    comments?: string
  ) => {
    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const project = await projectService.rejectProject(projectId, reason, comments);
      setState((prev) => ({
        ...prev,
        loading: false,
        success: 'Projet refusé. L\'étudiant a été notifié.',
        projects: prev.projects.map((p) => (p.id === project.id ? project : p)),
        currentProject: prev.currentProject?.id === project.id ? project : prev.currentProject,
      }));
      return project;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors du refus du projet',
      }));
      throw error;
    }
  }, []);

  /**
   * ÉTAPE 2 : Assigner un encadrant (Admin)
   */
  const assignProfessor = useCallback(async (assignment: ProjectAssignment) => {
    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const project = await projectService.assignProfessor(assignment);
      setState((prev) => ({
        ...prev,
        loading: false,
        success: 'Encadrant assigné avec succès !',
        projects: prev.projects.map((p) => (p.id === project.id ? project : p)),
      }));
      return project;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de l\'assignation de l\'encadrant',
      }));
      throw error;
    }
  }, []);

  /**
   * ÉTAPE 5 : Soumettre le rapport final (Étudiant)
   */
  const submitFinalReport = useCallback(async (projectId: number, finalReport: File) => {
    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const project = await projectService.submitFinalReport(projectId, finalReport);
      setState((prev) => ({
        ...prev,
        loading: false,
        success: 'Rapport final soumis avec succès ! Votre projet est maintenant prêt pour la soutenance.',
        currentProject: project,
      }));
      return project;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la soumission du rapport final',
      }));
      throw error;
    }
  }, []);

  /**
   * ÉTAPE 4 : Soumettre un livrable (Étudiant)
   */
  const submitDeliverable = useCallback(async (submission: DeliverableSubmission) => {
    setState((prev) => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const deliverable = await projectService.submitDeliverable(submission);
      setState((prev) => ({
        ...prev,
        loading: false,
        success: 'Livrable soumis avec succès !',
        deliverables: [...prev.deliverables, deliverable],
      }));
      return deliverable;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la soumission du livrable',
      }));
      throw error;
    }
  }, []);

  /**
   * Récupérer les projets d'un professeur
   */
  const fetchProfessorProjects = useCallback(async (professorId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const projects = await projectService.getProjectsByProfessor(professorId);
      setState((prev) => ({
        ...prev,
        loading: false,
        projects,
      }));
      return projects;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération des projets',
      }));
      throw error;
    }
  }, []);

  /**
   * Récupérer le projet d'un étudiant
   */
  const fetchStudentProject = useCallback(async (studentId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const project = await projectService.getProjectByStudent(studentId);
      setState((prev) => ({
        ...prev,
        loading: false,
        currentProject: project,
      }));
      return project;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération du projet',
      }));
      throw error;
    }
  }, []);

  /**
   * Récupérer un projet par ID
   */
  const fetchProjectById = useCallback(async (projectId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const project = await projectService.getProjectById(projectId);
      setState((prev) => ({
        ...prev,
        loading: false,
        currentProject: project,
      }));
      return project;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération du projet',
      }));
      throw error;
    }
  }, []);

  /**
   * ÉTAPE 2 : Récupérer les projets en attente d'assignation (Admin)
   */
  const fetchPendingAssignments = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const projects = await projectService.getPendingAssignments();
      setState((prev) => ({
        ...prev,
        loading: false,
        projects,
      }));
      return projects;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération des projets en attente',
      }));
      throw error;
    }
  }, []);

  /**
   * ÉTAPE 2 : Obtenir des recommandations d'encadrants (Admin)
   */
  const fetchAssignmentRecommendations = useCallback(async (projectId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const recommendations = await projectService.getAssignmentRecommendations(projectId);
      setState((prev) => ({
        ...prev,
        loading: false,
        recommendations,
      }));
      return recommendations;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération des recommandations',
      }));
      throw error;
    }
  }, []);

  /**
   * Récupérer les projets prêts pour soutenance (Professeur)
   */
  const fetchProjectsReadyForDefense = useCallback(async (professorId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const projects = await projectService.getProjectsReadyForDefense(professorId);
      setState((prev) => ({
        ...prev,
        loading: false,
        projects,
      }));
      return projects;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération des projets prêts pour soutenance',
      }));
      throw error;
    }
  }, []);

  /**
   * Récupérer les livrables d'un projet
   */
  const fetchDeliverables = useCallback(async (projectId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const deliverables = await projectService.getDeliverables(projectId);
      setState((prev) => ({
        ...prev,
        loading: false,
        deliverables,
      }));
      return deliverables;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la récupération des livrables',
      }));
      throw error;
    }
  }, []);

  /**
   * Télécharger un fichier
   */
  const downloadFile = useCallback(async (fileUrl: string, filename: string) => {
    try {
      const blob = await projectService.downloadFile(fileUrl);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Erreur lors du téléchargement du fichier',
      }));
      throw error;
    }
  }, []);

  return {
    // État
    ...state,
    
    // Actions Étudiant
    submitProject,
    submitDeliverable,
    submitFinalReport,
    
    // Actions Professeur
    acceptProject,
    rejectProject,
    fetchProjectsReadyForDefense,
    
    // Actions Admin
    assignProfessor,
    fetchPendingAssignments,
    fetchAssignmentRecommendations,
    
    // Récupération de données
    fetchProfessorProjects,
    fetchStudentProject,
    fetchProjectById,
    fetchDeliverables,
    
    // Utilitaires
    downloadFile,
    clearMessages,
  };
}
