package ma.xproce.pfehub.service;

import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.web.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ISoutenanceService {
    
    // CRUD
    Optional<Soutenance> getDefenseById(Long id);
    void deleteDefense(Long id);
    
    // Queries
    Page<Soutenance> getAllDefenses(Pageable pageable);
    Page<Soutenance> getDefensesByStatus(SoutenanceStatus status, Pageable pageable);
    Optional<Soutenance> getDefenseByProjectId(Long projectId);
    Optional<Soutenance> getDefenseByStudentId(Long studentId);
    List<Soutenance> getDefensesByProfessorId(Long professorId);
    List<Soutenance> getPendingProposals();
    List<Soutenance> getUpcomingDefenses(LocalDate fromDate);
    List<Soutenance> getDefensesByDateRange(LocalDate startDate, LocalDate endDate);
    
    // Workflow - Propose (Professor)
    Soutenance proposeDefense(DefenseProposalDTO dto);
    
    // Workflow - Admin Actions
    Soutenance validateDefense(DefenseValidationDTO dto);
    Soutenance modifyDefense(DefenseModificationDTO dto);
    Soutenance rejectDefense(DefenseRejectionDTO dto);
    
    // Workflow - Evaluation (Professor)
    Soutenance evaluateDefense(DefenseEvaluationDTO dto);
    List<Soutenance> getEvaluatedDefenses();
    
    // Jury Management
    List<JuryMember> getJuryMembers(Long defenseId);
    void updateJuryMembers(Long defenseId, List<JuryMemberDTO> juryMembers);
    
    // Room/Schedule conflicts
    boolean hasConflict(String room, LocalDate date, String time);
    List<Soutenance> getDefensesByRoomAndDate(String room, LocalDate date);
    
    // Statistics
    long countByStatus(SoutenanceStatus status);
    long countUpcoming();
}
