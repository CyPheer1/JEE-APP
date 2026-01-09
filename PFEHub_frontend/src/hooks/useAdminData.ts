/**
 * Hook personnalisé pour la gestion des données Admin
 * Fournit des fonctions réactives pour les opérations CRUD
 */

import { useState, useEffect, useCallback } from 'react';
import { adminService, Department, Specialization, AcademicYear, DashboardStats, Student, Professor } from '../services/adminService';

// ============= Types =============

interface UseAdminDataReturn {
  // State
  loading: boolean;
  error: string | null;
  
  // Dashboard
  stats: DashboardStats | null;
  refreshStats: () => Promise<void>;
  
  // Departments
  departments: Department[];
  refreshDepartments: () => Promise<void>;
  createDepartment: (data: { name: string; code: string; description?: string }) => Promise<boolean>;
  updateDepartment: (id: number, data: { name?: string; code?: string; description?: string }) => Promise<boolean>;
  deleteDepartment: (id: number) => Promise<boolean>;
  
  // Specializations
  specializations: Specialization[];
  refreshSpecializations: () => Promise<void>;
  createSpecialization: (data: { name: string; code: string; departmentId: number; description?: string }) => Promise<boolean>;
  updateSpecialization: (id: number, data: { name?: string; code?: string; departmentId?: number; description?: string }) => Promise<boolean>;
  deleteSpecialization: (id: number) => Promise<boolean>;
  
  // Academic Years
  academicYears: AcademicYear[];
  currentAcademicYear: AcademicYear | null;
  refreshAcademicYears: () => Promise<void>;
  createAcademicYear: (data: any) => Promise<boolean>;
  updateAcademicYear: (id: number, data: any) => Promise<boolean>;
  deleteAcademicYear: (id: number) => Promise<boolean>;
  
  // Users
  students: Student[];
  professors: Professor[];
  refreshStudents: () => Promise<void>;
  refreshProfessors: () => Promise<void>;
  createStudent: (data: any) => Promise<boolean>;
  createProfessor: (data: any) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
}

export function useAdminData(): UseAdminDataReturn {
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [currentAcademicYear, setCurrentAcademicYear] = useState<AcademicYear | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);

  // ============= Dashboard Stats =============
  
  const refreshStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, []);

  // ============= Departments =============
  
  const refreshDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllDepartments();
      setDepartments(data);
    } catch (err: any) {
      console.error('Error fetching departments:', err);
      setError(err.message || 'Erreur lors du chargement des départements');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDepartment = useCallback(async (data: { name: string; code: string; description?: string }) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.createDepartment(data);
      await refreshDepartments();
      return true;
    } catch (err: any) {
      console.error('Error creating department:', err);
      setError(err.message || 'Erreur lors de la création du département');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshDepartments]);

  const updateDepartment = useCallback(async (id: number, data: { name?: string; code?: string; description?: string }) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.updateDepartment(id, data);
      await refreshDepartments();
      return true;
    } catch (err: any) {
      console.error('Error updating department:', err);
      setError(err.message || 'Erreur lors de la mise à jour du département');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshDepartments]);

  const deleteDepartment = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.deleteDepartment(id);
      await refreshDepartments();
      return true;
    } catch (err: any) {
      console.error('Error deleting department:', err);
      setError(err.message || 'Erreur lors de la suppression du département');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshDepartments]);

  // ============= Specializations =============
  
  const refreshSpecializations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllSpecializations();
      setSpecializations(data);
    } catch (err: any) {
      console.error('Error fetching specializations:', err);
      setError(err.message || 'Erreur lors du chargement des spécialisations');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSpecialization = useCallback(async (data: { name: string; code: string; departmentId: number; description?: string }) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.createSpecialization(data);
      await refreshSpecializations();
      return true;
    } catch (err: any) {
      console.error('Error creating specialization:', err);
      setError(err.message || 'Erreur lors de la création de la spécialisation');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshSpecializations]);

  const updateSpecialization = useCallback(async (id: number, data: { name?: string; code?: string; departmentId?: number; description?: string }) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.updateSpecialization(id, data);
      await refreshSpecializations();
      return true;
    } catch (err: any) {
      console.error('Error updating specialization:', err);
      setError(err.message || 'Erreur lors de la mise à jour de la spécialisation');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshSpecializations]);

  const deleteSpecialization = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.deleteSpecialization(id);
      await refreshSpecializations();
      return true;
    } catch (err: any) {
      console.error('Error deleting specialization:', err);
      setError(err.message || 'Erreur lors de la suppression de la spécialisation');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshSpecializations]);

  // ============= Academic Years =============
  
  const refreshAcademicYears = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [years, current] = await Promise.all([
        adminService.getAllAcademicYears(),
        adminService.getCurrentAcademicYear()
      ]);
      setAcademicYears(years);
      setCurrentAcademicYear(current);
    } catch (err: any) {
      console.error('Error fetching academic years:', err);
      setError(err.message || 'Erreur lors du chargement des années universitaires');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAcademicYear = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.createAcademicYear(data);
      await refreshAcademicYears();
      return true;
    } catch (err: any) {
      console.error('Error creating academic year:', err);
      setError(err.message || 'Erreur lors de la création de l\'année universitaire');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshAcademicYears]);

  const updateAcademicYear = useCallback(async (id: number, data: any) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.updateAcademicYear(id, data);
      await refreshAcademicYears();
      return true;
    } catch (err: any) {
      console.error('Error updating academic year:', err);
      setError(err.message || 'Erreur lors de la mise à jour de l\'année universitaire');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshAcademicYears]);

  const deleteAcademicYear = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.deleteAcademicYear(id);
      await refreshAcademicYears();
      return true;
    } catch (err: any) {
      console.error('Error deleting academic year:', err);
      setError(err.message || 'Erreur lors de la suppression de l\'année universitaire');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshAcademicYears]);

  // ============= Users =============
  
  const refreshStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllStudents();
      setStudents(data);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfessors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllProfessors();
      setProfessors(data);
    } catch (err: any) {
      console.error('Error fetching professors:', err);
      setError(err.message || 'Erreur lors du chargement des encadrants');
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.createStudent(data);
      await refreshStudents();
      return true;
    } catch (err: any) {
      console.error('Error creating student:', err);
      setError(err.message || 'Erreur lors de la création de l\'étudiant');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshStudents]);

  const createProfessor = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.createProfessor(data);
      await refreshProfessors();
      return true;
    } catch (err: any) {
      console.error('Error creating professor:', err);
      setError(err.message || 'Erreur lors de la création de l\'encadrant');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshProfessors]);

  const deleteUser = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await adminService.deleteStudent(id);
      await Promise.all([refreshStudents(), refreshProfessors()]);
      return true;
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Erreur lors de la suppression de l\'utilisateur');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshStudents, refreshProfessors]);

  // ============= Initial Load =============
  
  useEffect(() => {
    // Load all data on mount
    Promise.all([
      refreshStats(),
      refreshDepartments(),
      refreshSpecializations(),
      refreshAcademicYears(),
      refreshStudents(),
      refreshProfessors()
    ]).catch(console.error);
  }, []);

  return {
    loading,
    error,
    stats,
    refreshStats,
    departments,
    refreshDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    specializations,
    refreshSpecializations,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization,
    academicYears,
    currentAcademicYear,
    refreshAcademicYears,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
    students,
    professors,
    refreshStudents,
    refreshProfessors,
    createStudent,
    createProfessor,
    deleteUser,
  };
}

export default useAdminData;
