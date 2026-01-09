/**
 * Service Admin pour PFEHub
 * Gère toutes les opérations d'administration (départements, spécialisations, utilisateurs, etc.)
 */

import { apiClient } from './apiClient';

// ============= Types =============

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  createdAt?: string;
}

export interface DepartmentWithStats extends Department {
  studentsCount?: number;
  professorsCount?: number;
  specializationsCount?: number;
}

export interface Specialization {
  id: number;
  name: string;
  code: string;
  description?: string;
  departement?: Department;
  createdAt?: string;
}

export interface SpecializationWithStats extends Specialization {
  studentsCount?: number;
}

export interface AcademicYear {
  id: number;
  year: string;
  submissionStartDate: string;
  submissionEndDate: string;
  defenseStartDate: string;
  defenseEndDate: string;
  isCurrent: boolean;
  createdAt?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalProfessors: number;
  activeProjects: number;
  upcomingDefenses: number;
  projectsByStatus?: Record<string, number>;
  projectsByDepartment?: Record<string, number>;
  recentSubmissions?: any[];
}

export interface UserBase {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ETUDIANT' | 'ENCADRANT' | 'ADMIN';
  isActive: boolean;
  departement?: Department;
  specialite?: Specialization;
  createdAt?: string;
}

export interface Student extends UserBase {
  numeroEtudiant: string;
  promotion: string;
  anneeUniversitaire?: AcademicYear;
}

export interface Professor extends UserBase {
  expertise: string[];
  maxProjectCapacity: number;
  currentProjectsCount?: number;
}

export interface Admin extends UserBase {
  permissions: string[];
}

// ============= Create DTOs =============

export interface CreateDepartmentDTO {
  name: string;
  code: string;
  description?: string;
}

export interface CreateSpecializationDTO {
  name: string;
  code: string;
  description?: string;
  departmentId: number;
}

export interface CreateAcademicYearDTO {
  year: string;
  submissionStartDate: string;
  submissionEndDate: string;
  defenseStartDate: string;
  defenseEndDate: string;
  isCurrent?: boolean;
}

export interface CreateStudentDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  numeroEtudiant: string;
  promotion: string;
  departementId: number;
  specialiteId: number;
  anneeUniversitaireId?: number;
}

export interface CreateProfessorDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  departementId: number;
  specialiteId?: number;
  expertise: string[];
  maxProjectCapacity: number;
}

// ============= Admin Service =============

export const adminService = {
  // ============= Dashboard =============
  
  async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/admin/dashboard');
  },

  // ============= Departments =============
  
  async getAllDepartments(): Promise<Department[]> {
    return apiClient.get<Department[]>('/admin/departments');
  },

  async getDepartmentById(id: number): Promise<Department> {
    return apiClient.get<Department>(`/admin/departments/${id}`);
  },

  async createDepartment(data: CreateDepartmentDTO): Promise<Department> {
    return apiClient.post<Department>('/admin/departments', data);
  },

  async updateDepartment(id: number, data: Partial<CreateDepartmentDTO>): Promise<Department> {
    return apiClient.put<Department>(`/admin/departments/${id}`, data);
  },

  async deleteDepartment(id: number): Promise<void> {
    return apiClient.delete(`/admin/departments/${id}`);
  },

  // ============= Specializations =============
  
  async getAllSpecializations(): Promise<Specialization[]> {
    return apiClient.get<Specialization[]>('/admin/specializations');
  },

  async getSpecializationById(id: number): Promise<Specialization> {
    return apiClient.get<Specialization>(`/admin/specializations/${id}`);
  },

  async getSpecializationsByDepartment(departmentId: number): Promise<Specialization[]> {
    return apiClient.get<Specialization[]>(`/admin/departments/${departmentId}/specializations`);
  },

  async createSpecialization(data: CreateSpecializationDTO): Promise<Specialization> {
    return apiClient.post<Specialization>('/admin/specializations', data);
  },

  async updateSpecialization(id: number, data: Partial<CreateSpecializationDTO>): Promise<Specialization> {
    return apiClient.put<Specialization>(`/admin/specializations/${id}`, data);
  },

  async deleteSpecialization(id: number): Promise<void> {
    return apiClient.delete(`/admin/specializations/${id}`);
  },

  // ============= Academic Years =============
  
  async getAllAcademicYears(): Promise<AcademicYear[]> {
    return apiClient.get<AcademicYear[]>('/admin/academic-years');
  },

  async getCurrentAcademicYear(): Promise<AcademicYear | null> {
    try {
      return await apiClient.get<AcademicYear>('/admin/academic-years/current');
    } catch {
      return null;
    }
  },

  async getAcademicYearById(id: number): Promise<AcademicYear> {
    return apiClient.get<AcademicYear>(`/admin/academic-years/${id}`);
  },

  async createAcademicYear(data: CreateAcademicYearDTO): Promise<AcademicYear> {
    return apiClient.post<AcademicYear>('/admin/academic-years', data);
  },

  async updateAcademicYear(id: number, data: Partial<CreateAcademicYearDTO>): Promise<AcademicYear> {
    return apiClient.put<AcademicYear>(`/admin/academic-years/${id}`, data);
  },

  async deleteAcademicYear(id: number): Promise<void> {
    return apiClient.delete(`/admin/academic-years/${id}`);
  },

  // ============= Users =============
  
  async getAllStudents(): Promise<Student[]> {
    return apiClient.get<Student[]>('/users/students');
  },

  async getStudentById(id: number): Promise<Student> {
    return apiClient.get<Student>(`/users/students/${id}`);
  },

  async createStudent(data: CreateStudentDTO): Promise<Student> {
    return apiClient.post<Student>('/users/students', data);
  },

  async updateStudent(id: number, data: Partial<CreateStudentDTO>): Promise<Student> {
    return apiClient.put<Student>(`/users/students/${id}`, data);
  },

  async deleteStudent(id: number): Promise<void> {
    return apiClient.delete(`/users/${id}`);
  },

  async getAllProfessors(): Promise<Professor[]> {
    return apiClient.get<Professor[]>('/users/professors');
  },

  async getProfessorById(id: number): Promise<Professor> {
    return apiClient.get<Professor>(`/users/professors/${id}`);
  },

  async createProfessor(data: CreateProfessorDTO): Promise<Professor> {
    return apiClient.post<Professor>('/users/professors', data);
  },

  async updateProfessor(id: number, data: Partial<CreateProfessorDTO>): Promise<Professor> {
    return apiClient.put<Professor>(`/users/professors/${id}`, data);
  },

  async deleteProfessor(id: number): Promise<void> {
    return apiClient.delete(`/users/${id}`);
  },

  async getAllAdmins(): Promise<Admin[]> {
    return apiClient.get<Admin[]>('/users/admins');
  },

  // ============= Assignments =============
  
  async getPendingAssignments(): Promise<any[]> {
    return apiClient.get<any[]>('/admin/assignments/pending');
  },

  async assignProfessor(projectId: number, professorId: number): Promise<void> {
    return apiClient.post(`/admin/assignments`, { projectId, professorId });
  },

  // ============= Defenses =============
  
  async getPendingDefenses(): Promise<any[]> {
    return apiClient.get<any[]>('/admin/defenses/pending');
  },

  async validateDefense(defenseId: number, validated: boolean, reason?: string): Promise<void> {
    return apiClient.post(`/admin/defenses/${defenseId}/validate`, { validated, reason });
  },
};

export default adminService;
