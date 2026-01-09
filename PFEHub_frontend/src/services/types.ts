/**
 * Types TypeScript pour PFEHub
 * Définitions des interfaces correspondant aux entités backend
 */

// ============= ENUMS =============

export type ProjectStatus = 
  | 'EN_ATTENTE_ASSIGNATION'
  | 'EN_REVISION'
  | 'REFUSE'
  | 'ACCEPTE'
  | 'EN_COURS'
  | 'SOUMISSION_FINALE'
  | 'SOUTENANCE_PLANIFIEE'
  | 'EVALUE';

export type DefenseStatus = 
  | 'PROPOSEE'
  | 'VALIDEE'
  | 'REPORTEE'
  | 'MODIFIEE';

export type JuryRole = 
  | 'PRESIDENT'
  | 'EXAMINATEUR';

export type UserRole = 
  | 'ETUDIANT'
  | 'ENCADRANT'
  | 'ADMIN';

// ============= USER =============

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department?: Department;
  specialization?: Specialization;
}

export interface Student extends User {
  studentNumber: string;
  promotion: string;
}

export interface Professor extends User {
  expertise: string[];
  currentProjectCount: number;
  maxProjectCapacity: number;
}

export interface Admin extends User {
  permissions: string[];
}

// ============= ACADEMIC STRUCTURE =============

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
}

export interface Specialization {
  id: number;
  name: string;
  code: string;
  department: Department;
  description?: string;
  createdAt: string;
}

// ============= PROJECT =============

export interface Project {
  id: number;
  title: string;
  description: string;
  objectives: string;
  context?: string;
  methodology?: string;
  expectedResults?: string;
  keywords?: string[];
  status: ProjectStatus;
  student: Student;
  professor?: Professor;
  proposalFile?: string; // URL du PDF
  submittedAt: string;
  assignedAt?: string;
  acceptedAt?: string;
  finalSubmittedAt?: string;
  professorComments?: string;
  rejectionReason?: string;
}

export interface ProjectSubmission {
  title: string;
  description: string;
  objectives: string;
  context?: string;
  methodology?: string;
  expectedResults?: string;
  keywords?: string[];
  proposalFile: File;
}

// ============= DELIVERABLE =============

export interface Deliverable {
  id: number;
  project: Project;
  title: string;
  description: string;
  type: 'RAPPORT_AVANCEMENT' | 'CODE' | 'DOCUMENTATION' | 'AUTRE';
  fileUrl: string;
  submittedAt: string;
  notes?: string;
}

export interface DeliverableSubmission {
  projectId: number;
  title: string;
  description: string;
  type: 'RAPPORT_AVANCEMENT' | 'CODE' | 'DOCUMENTATION' | 'AUTRE';
  file: File;
  notes?: string;
}

// ============= DEFENSE (SOUTENANCE) =============

export interface Defense {
  id: number;
  project: Project;
  proposedDate: string; // ISO Date string
  proposedTime: string; // HH:mm format
  proposedRoom: string;
  finalDate?: string;
  finalTime?: string;
  finalRoom?: string;
  status: DefenseStatus;
  juryMembers: JuryMember[];
  proposedAt: string;
  validatedAt?: string;
  validatedBy?: Admin;
  rejectionReason?: string;
  modificationReason?: string;
  evaluation?: DefenseEvaluation;
}

export interface JuryMember {
  id: number;
  name: string;
  email?: string;
  role: JuryRole;
  professor?: Professor;
}

export interface DefenseProposal {
  projectId: number;
  proposedDate: string; // Format: YYYY-MM-DD
  proposedTime: string; // Format: HH:mm
  proposedRoom: string;
  juryMembers: {
    name: string;
    email?: string;
    role: JuryRole;
  }[];
  notes?: string;
}

export interface DefenseValidation {
  defenseId: number;
  finalDate?: string;
  finalTime?: string;
  finalRoom?: string;
  juryMembers?: {
    id?: number;
    name: string;
    email?: string;
    role: JuryRole;
  }[];
  notes?: string;
}

export interface DefenseModification {
  defenseId: number;
  finalDate: string;
  finalTime: string;
  finalRoom: string;
  modificationReason: string;
  juryMembers?: {
    id?: number;
    name: string;
    email?: string;
    role: JuryRole;
  }[];
}

export interface DefenseRejection {
  defenseId: number;
  rejectionReason: string;
}

// ============= EVALUATION =============

export interface DefenseEvaluation {
  id: number;
  defense: Defense;
  presentationQuality: number; // Note sur 20
  subjectMastery: number; // Note sur 20
  questionAnswers: number; // Note sur 20
  timeRespect: number; // Note sur 20
  finalGrade: number; // Note finale sur 20
  comments: string;
  strengths?: string;
  improvements?: string;
  evaluatedAt: string;
  evaluatedBy: Professor;
}

export interface DefenseEvaluationSubmission {
  defenseId: number;
  presentationQuality: number;
  subjectMastery: number;
  questionAnswers: number;
  timeRespect: number;
  finalGrade: number;
  comments: string;
  strengths?: string;
  improvements?: string;
}

// ============= ASSIGNMENT =============

export interface AssignmentRecommendation {
  project: Project;
  professor: Professor;
  matchPercentage: number;
  workload: number;
  expertise: string[];
  reason: string;
}

export interface ProjectAssignment {
  projectId: number;
  professorId: number;
  notes?: string;
}

// ============= ACADEMIC YEAR =============

export interface AcademicYear {
  id: number;
  year: string; // Ex: "2024-2025"
  submissionStartDate: string;
  submissionEndDate: string;
  defenseStartDate: string;
  defenseEndDate: string;
  isCurrent: boolean;
  createdAt: string;
}

export interface AcademicYearConfig {
  year: string;
  submissionStartDate: string;
  submissionEndDate: string;
  defenseStartDate: string;
  defenseEndDate: string;
}

// ============= STATISTICS =============

export interface DashboardStats {
  totalStudents: number;
  totalProfessors: number;
  activeProjects: number;
  upcomingDefenses: number;
  projectsByDepartment: {
    department: string;
    count: number;
  }[];
  projectsByStatus: {
    status: ProjectStatus;
    count: number;
  }[];
  recentSubmissions: Project[];
}

export interface ProfessorStats {
  supervisedProjects: number;
  completedProjects: number;
  averageGrade: number;
  pendingReview: number;
  upcomingDefenses: number;
  projectsByStatus: {
    status: ProjectStatus;
    count: number;
  }[];
}

export interface StudentStats {
  projectStatus: ProjectStatus;
  deliverablesSubmitted: number;
  daysUntilDefense?: number;
  hasDefense: boolean;
  evaluationReceived: boolean;
}

// ============= NOTIFICATIONS =============

export interface Notification {
  id: number;
  userId: number;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// ============= PAGINATION =============

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}
