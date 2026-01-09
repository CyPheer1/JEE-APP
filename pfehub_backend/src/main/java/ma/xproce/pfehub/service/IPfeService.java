package ma.xproce.pfehub.service;

import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.web.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IPfeService {
    
    // CRUD
    PFE createProject(Long studentId, ProjectSubmissionDTO dto, MultipartFile proposalFile);
    PFE updateProject(Long projectId, ProjectUpdateDTO dto);
    Optional<PFE> getProjectById(Long id);
    void deleteProject(Long id);
    
    // Queries
    Page<PFE> getAllProjects(Pageable pageable);
    Page<PFE> getProjectsByStatus(PFEStatus status, Pageable pageable);
    Optional<PFE> getProjectByStudentId(Long studentId);
    List<PFE> getProjectsByProfessorId(Long professorId);
    List<PFE> getPendingAssignmentProjects();
    Page<PFE> searchProjects(String search, Pageable pageable);
    
    // Workflow - Assignment (Admin)
    PFE assignProfessor(Long projectId, Long professorId, String notes);
    List<AssignmentRecommendationDTO> getAssignmentRecommendations(Long projectId);
    
    // Workflow - Review (Professor)
    PFE acceptProject(Long projectId, String comments);
    PFE rejectProject(Long projectId, String reason, String comments);
    PFE requestRevision(Long projectId, String comments);
    
    // Workflow - Final Submission (Student)
    PFE submitFinalVersion(Long projectId, MultipartFile finalDocument);
    
    // Deliverables
    Livrable addDeliverable(Long projectId, DeliverableSubmissionDTO dto, MultipartFile file);
    List<Livrable> getProjectDeliverables(Long projectId);
    void deleteDeliverable(Long deliverableId);
    
    // Statistics
    long countByStatus(PFEStatus status);
    long countActiveProjects();
    List<ProjectStatusCountDTO> getProjectsCountByStatus();
    List<DepartmentProjectCountDTO> getProjectsCountByDepartment();
    List<PFE> getRecentSubmissions(int limit);
}
