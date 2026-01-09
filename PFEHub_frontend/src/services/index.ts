/**
 * Point d'entrée centralisé pour tous les services de PFEHub
 * 
 * Usage:
 * import { defenseService, projectService, apiClient, adminService } from '@/services';
 */

// Services
export { apiClient } from './apiClient';
export { defenseService } from './defenseService';
export { projectService } from './projectService';
export { adminService } from './adminService';

// Types
export * from './types';
export * from './adminService';

// Re-export pour faciliter les imports
export type { ApiResponse, ApiError } from './apiClient';
