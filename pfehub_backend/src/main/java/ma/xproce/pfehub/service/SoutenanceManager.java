package ma.xproce.pfehub.service;

import lombok.RequiredArgsConstructor;
import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.dao.repositories.*;
import ma.xproce.pfehub.web.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class SoutenanceManager implements ISoutenanceService {

    private final SoutenanceRepository soutenanceRepository;
    private final PfeRepository pfeRepository;
    private final EncadrantRepository encadrantRepository;
    private final AdminRepository adminRepository;
    private final JuryMemberRepository juryMemberRepository;

    @Override
    public Optional<Soutenance> getDefenseById(Long id) {
        return soutenanceRepository.findById(id);
    }

    @Override
    public void deleteDefense(Long id) {
        soutenanceRepository.deleteById(id);
    }

    @Override
    public Page<Soutenance> getAllDefenses(Pageable pageable) {
        return soutenanceRepository.findAll(pageable);
    }

    @Override
    public Page<Soutenance> getDefensesByStatus(SoutenanceStatus status, Pageable pageable) {
        return soutenanceRepository.findByStatus(status, pageable);
    }

    @Override
    public Optional<Soutenance> getDefenseByProjectId(Long projectId) {
        return soutenanceRepository.findByPfeId(projectId);
    }

    @Override
    public Optional<Soutenance> getDefenseByStudentId(Long studentId) {
        return soutenanceRepository.findByPfeEtudiantId(studentId);
    }

    @Override
    public List<Soutenance> getDefensesByProfessorId(Long professorId) {
        return soutenanceRepository.findByEncadrantId(professorId);
    }

    @Override
    public List<Soutenance> getPendingProposals() {
        return soutenanceRepository.findPendingProposals();
    }

    @Override
    public List<Soutenance> getUpcomingDefenses(LocalDate fromDate) {
        return soutenanceRepository.findUpcomingDefenses(fromDate);
    }

    @Override
    public List<Soutenance> getDefensesByDateRange(LocalDate startDate, LocalDate endDate) {
        return soutenanceRepository.findByDateRange(startDate, endDate);
    }

    @Override
    public Soutenance proposeDefense(DefenseProposalDTO dto) {
        PFE pfe = pfeRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Check if defense already exists for this project
        if (soutenanceRepository.findByPfeId(dto.getProjectId()).isPresent()) {
            throw new RuntimeException("Defense already exists for this project");
        }

        Soutenance soutenance = new Soutenance();
        soutenance.setPfe(pfe);
        soutenance.setProposedDate(LocalDate.parse(dto.getProposedDate()));
        soutenance.setProposedTime(LocalTime.parse(dto.getProposedTime()));
        soutenance.setProposedRoom(dto.getProposedRoom());
        soutenance.setStatus(SoutenanceStatus.PROPOSEE);
        soutenance.setProposedAt(LocalDateTime.now());
        soutenance.setNotes(dto.getNotes());

        // Update PFE status
        pfe.setStatus(PFEStatus.SOUTENANCE_PLANIFIEE);
        pfeRepository.save(pfe);

        Soutenance savedSoutenance = soutenanceRepository.save(soutenance);

        // Add jury members
        if (dto.getJuryMembers() != null) {
            for (JuryMemberDTO juryDto : dto.getJuryMembers()) {
                JuryMember juryMember = new JuryMember();
                juryMember.setName(juryDto.getName());
                juryMember.setEmail(juryDto.getEmail());
                juryMember.setRole(juryDto.getRole());
                juryMember.setSoutenance(savedSoutenance);
                
                if (juryDto.getProfessorId() != null) {
                    encadrantRepository.findById(juryDto.getProfessorId())
                            .ifPresent(juryMember::setProfessor);
                }
                
                juryMemberRepository.save(juryMember);
            }
        }

        return savedSoutenance;
    }

    @Override
    public Soutenance validateDefense(DefenseValidationDTO dto) {
        Soutenance soutenance = soutenanceRepository.findById(dto.getDefenseId())
                .orElseThrow(() -> new RuntimeException("Defense not found"));

        soutenance.setStatus(SoutenanceStatus.VALIDEE);
        soutenance.setValidatedAt(LocalDateTime.now());

        // Set final date/time/room (use proposed if not provided)
        if (dto.getFinalDate() != null) {
            soutenance.setFinalDate(LocalDate.parse(dto.getFinalDate()));
        } else {
            soutenance.setFinalDate(soutenance.getProposedDate());
        }
        
        if (dto.getFinalTime() != null) {
            soutenance.setFinalTime(LocalTime.parse(dto.getFinalTime()));
        } else {
            soutenance.setFinalTime(soutenance.getProposedTime());
        }
        
        if (dto.getFinalRoom() != null) {
            soutenance.setFinalRoom(dto.getFinalRoom());
        } else {
            soutenance.setFinalRoom(soutenance.getProposedRoom());
        }

        if (dto.getNotes() != null) {
            soutenance.setNotes(dto.getNotes());
        }

        // Update jury members if provided
        if (dto.getJuryMembers() != null && !dto.getJuryMembers().isEmpty()) {
            updateJuryMembers(dto.getDefenseId(), dto.getJuryMembers());
        }

        return soutenanceRepository.save(soutenance);
    }

    @Override
    public Soutenance modifyDefense(DefenseModificationDTO dto) {
        Soutenance soutenance = soutenanceRepository.findById(dto.getDefenseId())
                .orElseThrow(() -> new RuntimeException("Defense not found"));

        soutenance.setStatus(SoutenanceStatus.MODIFIEE);
        soutenance.setFinalDate(LocalDate.parse(dto.getFinalDate()));
        soutenance.setFinalTime(LocalTime.parse(dto.getFinalTime()));
        soutenance.setFinalRoom(dto.getFinalRoom());
        soutenance.setModificationReason(dto.getModificationReason());

        // Update jury members if provided
        if (dto.getJuryMembers() != null && !dto.getJuryMembers().isEmpty()) {
            updateJuryMembers(dto.getDefenseId(), dto.getJuryMembers());
        }

        return soutenanceRepository.save(soutenance);
    }

    @Override
    public Soutenance rejectDefense(DefenseRejectionDTO dto) {
        Soutenance soutenance = soutenanceRepository.findById(dto.getDefenseId())
                .orElseThrow(() -> new RuntimeException("Defense not found"));

        soutenance.setStatus(SoutenanceStatus.REPORTEE);
        soutenance.setRejectionReason(dto.getRejectionReason());

        // Revert PFE status
        PFE pfe = soutenance.getPfe();
        pfe.setStatus(PFEStatus.SOUMISSION_FINALE);
        pfeRepository.save(pfe);

        return soutenanceRepository.save(soutenance);
    }

    @Override
    public Soutenance evaluateDefense(DefenseEvaluationDTO dto) {
        Soutenance soutenance = soutenanceRepository.findById(dto.getDefenseId())
                .orElseThrow(() -> new RuntimeException("Defense not found"));

        soutenance.setPresentationQuality(dto.getPresentationQuality());
        soutenance.setSubjectMastery(dto.getSubjectMastery());
        soutenance.setQuestionAnswers(dto.getQuestionAnswers());
        soutenance.setTimeRespect(dto.getTimeRespect());
        soutenance.setFinalGrade(dto.getFinalGrade());
        soutenance.setEvaluationComments(dto.getComments());
        soutenance.setStrengths(dto.getStrengths());
        soutenance.setImprovements(dto.getImprovements());
        soutenance.setEvaluatedAt(LocalDateTime.now());

        // Set evaluator as the encadrant of the PFE
        soutenance.setEvaluatedBy(soutenance.getPfe().getEncadrant());

        // Update PFE status
        PFE pfe = soutenance.getPfe();
        pfe.setStatus(PFEStatus.EVALUE);
        pfeRepository.save(pfe);

        return soutenanceRepository.save(soutenance);
    }

    @Override
    public List<Soutenance> getEvaluatedDefenses() {
        return soutenanceRepository.findEvaluatedDefenses();
    }

    @Override
    public List<JuryMember> getJuryMembers(Long defenseId) {
        return juryMemberRepository.findBySoutenanceId(defenseId);
    }

    @Override
    public void updateJuryMembers(Long defenseId, List<JuryMemberDTO> juryMembers) {
        Soutenance soutenance = soutenanceRepository.findById(defenseId)
                .orElseThrow(() -> new RuntimeException("Defense not found"));

        // Delete existing jury members
        juryMemberRepository.deleteBySoutenanceId(defenseId);

        // Add new jury members
        for (JuryMemberDTO dto : juryMembers) {
            JuryMember juryMember = new JuryMember();
            juryMember.setName(dto.getName());
            juryMember.setEmail(dto.getEmail());
            juryMember.setRole(dto.getRole());
            juryMember.setSoutenance(soutenance);
            
            if (dto.getProfessorId() != null) {
                encadrantRepository.findById(dto.getProfessorId())
                        .ifPresent(juryMember::setProfessor);
            }
            
            juryMemberRepository.save(juryMember);
        }
    }

    @Override
    public boolean hasConflict(String room, LocalDate date, String time) {
        List<Soutenance> conflicts = soutenanceRepository.findByRoomAndDate(room, date);
        LocalTime checkTime = LocalTime.parse(time);
        
        for (Soutenance s : conflicts) {
            if (s.getFinalTime() != null && s.getFinalTime().equals(checkTime)) {
                return true;
            }
        }
        
        return false;
    }

    @Override
    public List<Soutenance> getDefensesByRoomAndDate(String room, LocalDate date) {
        return soutenanceRepository.findByRoomAndDate(room, date);
    }

    @Override
    public long countByStatus(SoutenanceStatus status) {
        return soutenanceRepository.countByStatus(status);
    }

    @Override
    public long countUpcoming() {
        return soutenanceRepository.countUpcoming(LocalDate.now());
    }
}
