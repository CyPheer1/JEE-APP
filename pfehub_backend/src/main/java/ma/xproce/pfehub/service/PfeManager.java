package ma.xproce.pfehub.service;

import lombok.RequiredArgsConstructor;
import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.dao.repositories.*;
import ma.xproce.pfehub.web.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PfeManager implements IPfeService {

    private final PfeRepository pfeRepository;
    private final EtudiantRepository etudiantRepository;
    private final EncadrantRepository encadrantRepository;
    private final LivrableRepository livrableRepository;
    private final IFileStorageService fileStorageService;

    @Override
    public PFE createProject(Long studentId, ProjectSubmissionDTO dto, MultipartFile proposalFile) {
        Etudiant etudiant = etudiantRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (pfeRepository.findByEtudiantId(studentId).isPresent()) {
            throw new RuntimeException("Student already has a project");
        }

        PFE pfe = new PFE();
        pfe.setTitle(dto.getTitle());
        pfe.setDescription(dto.getDescription());
        pfe.setObjectives(dto.getObjectives());
        pfe.setContext(dto.getContext());
        pfe.setMethodology(dto.getMethodology());
        pfe.setExpectedResults(dto.getExpectedResults());
        if (dto.getKeywords() != null) {
            pfe.setKeywords(String.join(",", dto.getKeywords()));
        }
        pfe.setStatus(PFEStatus.EN_ATTENTE_ASSIGNATION);
        pfe.setEtudiant(etudiant);
        pfe.setSubmittedAt(LocalDateTime.now());

        if (proposalFile != null && !proposalFile.isEmpty()) {
            String filePath = fileStorageService.storeFile(proposalFile, "proposals");
            pfe.setProposalFilePath(filePath);
        }

        return pfeRepository.save(pfe);
    }

    @Override
    public PFE updateProject(Long projectId, ProjectUpdateDTO dto) {
        PFE pfe = pfeRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (dto.getTitle() != null) pfe.setTitle(dto.getTitle());
        if (dto.getDescription() != null) pfe.setDescription(dto.getDescription());
        if (dto.getObjectives() != null) pfe.setObjectives(dto.getObjectives());
        if (dto.getContext() != null) pfe.setContext(dto.getContext());
        if (dto.getMethodology() != null) pfe.setMethodology(dto.getMethodology());
        if (dto.getExpectedResults() != null) pfe.setExpectedResults(dto.getExpectedResults());
        if (dto.getKeywords() != null) {
            pfe.setKeywords(String.join(",", dto.getKeywords()));
        }

        return pfeRepository.save(pfe);
    }

    @Override
    public Optional<PFE> getProjectById(Long id) {
        return pfeRepository.findById(id);
    }

    @Override
    public void deleteProject(Long id) {
        pfeRepository.deleteById(id);
    }

    @Override
    public Page<PFE> getAllProjects(Pageable pageable) {
        return pfeRepository.findAll(pageable);
    }

    @Override
    public Page<PFE> getProjectsByStatus(PFEStatus status, Pageable pageable) {
        return pfeRepository.findByStatus(status, pageable);
    }

    @Override
    public Optional<PFE> getProjectByStudentId(Long studentId) {
        return pfeRepository.findByEtudiantId(studentId);
    }

    @Override
    public List<PFE> getProjectsByProfessorId(Long professorId) {
        return pfeRepository.findByEncadrantId(professorId);
    }

    @Override
    public List<PFE> getPendingAssignmentProjects() {
        return pfeRepository.findPendingAssignment();
    }

    @Override
    public Page<PFE> searchProjects(String search, Pageable pageable) {
        return pfeRepository.searchProjects(search, pageable);
    }

    @Override
    public PFE assignProfessor(Long projectId, Long professorId, String notes) {
        PFE pfe = pfeRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Encadrant encadrant = encadrantRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        if (!encadrant.canAcceptMoreProjects()) {
            throw new RuntimeException("Professor has reached maximum project capacity");
        }

        pfe.setEncadrant(encadrant);
        pfe.setStatus(PFEStatus.EN_REVISION);
        pfe.setAssignedAt(LocalDateTime.now());
        if (notes != null) {
            pfe.setProfessorComments(notes);
        }

        return pfeRepository.save(pfe);
    }

    @Override
    public List<AssignmentRecommendationDTO> getAssignmentRecommendations(Long projectId) {
        PFE pfe = pfeRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<Encadrant> availableProfessors = encadrantRepository.findAvailableProfessors();
        List<AssignmentRecommendationDTO> recommendations = new ArrayList<>();

        for (Encadrant encadrant : availableProfessors) {
            int matchPercentage = calculateMatchPercentage(pfe, encadrant);
            
            AssignmentRecommendationDTO rec = AssignmentRecommendationDTO.builder()
                    .projectId(projectId)
                    .professorId(encadrant.getId())
                    .professorName(encadrant.getFullName())
                    .professorEmail(encadrant.getEmail())
                    .matchPercentage(matchPercentage)
                    .currentWorkload(encadrant.getCurrentProjectCount())
                    .maxCapacity(encadrant.getMaxProjectCapacity())
                    .expertise(encadrant.getExpertiseList())
                    .reason(generateMatchReason(pfe, encadrant, matchPercentage))
                    .build();
            
            recommendations.add(rec);
        }

        // Sort by match percentage descending
        recommendations.sort((a, b) -> b.getMatchPercentage() - a.getMatchPercentage());
        
        return recommendations.stream().limit(5).collect(Collectors.toList());
    }

    private int calculateMatchPercentage(PFE pfe, Encadrant encadrant) {
        int score = 0;
        
        // Same specialization = +40%
        if (pfe.getEtudiant().getSpecialite() != null && encadrant.getSpecialite() != null
                && pfe.getEtudiant().getSpecialite().getId().equals(encadrant.getSpecialite().getId())) {
            score += 40;
        }
        
        // Same department = +20%
        if (pfe.getEtudiant().getDepartement() != null && encadrant.getDepartement() != null
                && pfe.getEtudiant().getDepartement().getId().equals(encadrant.getDepartement().getId())) {
            score += 20;
        }
        
        // Keywords match expertise = +30%
        if (pfe.getKeywords() != null && encadrant.getExpertise() != null) {
            List<String> projectKeywords = pfe.getKeywordsList();
            List<String> expertiseList = encadrant.getExpertiseList();
            
            for (String keyword : projectKeywords) {
                for (String expertise : expertiseList) {
                    if (keyword.toLowerCase().contains(expertise.toLowerCase()) 
                            || expertise.toLowerCase().contains(keyword.toLowerCase())) {
                        score += 10;
                        break;
                    }
                }
            }
            score = Math.min(score, 90); // Cap at 90 for expertise
        }
        
        // Low workload bonus = +10%
        if (encadrant.getCurrentProjectCount() < encadrant.getMaxProjectCapacity() / 2) {
            score += 10;
        }
        
        return Math.min(score, 100);
    }

    private String generateMatchReason(PFE pfe, Encadrant encadrant, int matchPercentage) {
        StringBuilder reason = new StringBuilder();
        
        if (encadrant.getSpecialite() != null && pfe.getEtudiant().getSpecialite() != null
                && encadrant.getSpecialite().getId().equals(pfe.getEtudiant().getSpecialite().getId())) {
            reason.append("Même spécialisation. ");
        }
        
        if (matchPercentage >= 70) {
            reason.append("Excellente correspondance avec l'expertise. ");
        } else if (matchPercentage >= 50) {
            reason.append("Bonne correspondance. ");
        }
        
        reason.append("Charge: ").append(encadrant.getCurrentProjectCount())
              .append("/").append(encadrant.getMaxProjectCapacity());
        
        return reason.toString();
    }

    @Override
    public PFE acceptProject(Long projectId, String comments) {
        PFE pfe = pfeRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        pfe.setStatus(PFEStatus.ACCEPTE);
        pfe.setAcceptedAt(LocalDateTime.now());
        if (comments != null) {
            pfe.setProfessorComments(comments);
        }

        return pfeRepository.save(pfe);
    }

    @Override
    public PFE rejectProject(Long projectId, String reason, String comments) {
        PFE pfe = pfeRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        pfe.setStatus(PFEStatus.REFUSE);
        pfe.setRejectionReason(reason);
        if (comments != null) {
            pfe.setProfessorComments(comments);
        }

        return pfeRepository.save(pfe);
    }

    @Override
    public PFE requestRevision(Long projectId, String comments) {
        PFE pfe = pfeRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        pfe.setStatus(PFEStatus.EN_REVISION);
        pfe.setProfessorComments(comments);

        return pfeRepository.save(pfe);
    }

    @Override
    public PFE submitFinalVersion(Long projectId, MultipartFile finalDocument) {
        PFE pfe = pfeRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        pfe.setStatus(PFEStatus.SOUMISSION_FINALE);
        pfe.setFinalSubmittedAt(LocalDateTime.now());

        if (finalDocument != null && !finalDocument.isEmpty()) {
            String filePath = fileStorageService.storeFile(finalDocument, "final-submissions");
            pfe.setProposalFilePath(filePath);
        }

        return pfeRepository.save(pfe);
    }

    @Override
    public Livrable addDeliverable(Long projectId, DeliverableSubmissionDTO dto, MultipartFile file) {
        PFE pfe = pfeRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Livrable livrable = new Livrable();
        livrable.setPfe(pfe);
        livrable.setTitle(dto.getTitle());
        livrable.setDescription(dto.getDescription());
        livrable.setType(dto.getType());
        livrable.setNotes(dto.getNotes());
        livrable.setSubmittedAt(LocalDateTime.now());

        if (file != null && !file.isEmpty()) {
            String filePath = fileStorageService.storeFile(file, "deliverables");
            livrable.setFileUrl(filePath);
        }

        return livrableRepository.save(livrable);
    }

    @Override
    public List<Livrable> getProjectDeliverables(Long projectId) {
        return livrableRepository.findByPfeId(projectId);
    }

    @Override
    public void deleteDeliverable(Long deliverableId) {
        livrableRepository.deleteById(deliverableId);
    }

    @Override
    public long countByStatus(PFEStatus status) {
        return pfeRepository.countByStatus(status);
    }

    @Override
    public long countActiveProjects() {
        return pfeRepository.count() - pfeRepository.countByStatus(PFEStatus.EVALUE);
    }

    @Override
    public List<ProjectStatusCountDTO> getProjectsCountByStatus() {
        List<Object[]> results = pfeRepository.countByStatusGrouped();
        List<ProjectStatusCountDTO> counts = new ArrayList<>();
        
        for (Object[] result : results) {
            counts.add(new ProjectStatusCountDTO((PFEStatus) result[0], (Long) result[1]));
        }
        
        return counts;
    }

    @Override
    public List<DepartmentProjectCountDTO> getProjectsCountByDepartment() {
        List<Object[]> results = pfeRepository.countByDepartementGrouped();
        List<DepartmentProjectCountDTO> counts = new ArrayList<>();
        
        for (Object[] result : results) {
            counts.add(new DepartmentProjectCountDTO((String) result[0], (Long) result[1]));
        }
        
        return counts;
    }

    @Override
    public List<PFE> getRecentSubmissions(int limit) {
        return pfeRepository.findRecentSubmissions(PageRequest.of(0, limit));
    }
}
