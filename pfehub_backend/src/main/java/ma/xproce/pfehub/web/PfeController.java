package ma.xproce.pfehub.web;

import lombok.RequiredArgsConstructor;
import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.service.IPfeService;
import ma.xproce.pfehub.web.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"}, allowCredentials = "true")
public class PfeController {

    private final IPfeService pfeService;

    // ============= CRUD =============

    @GetMapping
    public ResponseEntity<Page<PFE>> getAllProjects(
            @RequestParam(required = false) PFEStatus status,
            Pageable pageable) {
        if (status != null) {
            return ResponseEntity.ok(pfeService.getProjectsByStatus(status, pageable));
        }
        return ResponseEntity.ok(pfeService.getAllProjects(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        return pfeService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        pfeService.deleteProject(id);
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
    }

    // ============= Student Endpoints =============

    @PostMapping("/submit")
    public ResponseEntity<PFE> submitProject(
            @RequestParam Long studentId,
            @RequestPart("data") ProjectSubmissionDTO dto,
            @RequestPart(value = "proposalFile", required = false) MultipartFile proposalFile) {
        return ResponseEntity.ok(pfeService.createProject(studentId, dto, proposalFile));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getProjectByStudent(@PathVariable Long studentId) {
        return pfeService.getProjectByStudentId(studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{projectId}/final-submit")
    public ResponseEntity<PFE> submitFinalVersion(
            @PathVariable Long projectId,
            @RequestPart(value = "file", required = false) MultipartFile finalDocument) {
        return ResponseEntity.ok(pfeService.submitFinalVersion(projectId, finalDocument));
    }

    // ============= Professor Endpoints =============

    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<PFE>> getProjectsByProfessor(@PathVariable Long professorId) {
        return ResponseEntity.ok(pfeService.getProjectsByProfessorId(professorId));
    }

    @PutMapping("/{projectId}/accept")
    public ResponseEntity<PFE> acceptProject(
            @PathVariable Long projectId,
            @RequestBody(required = false) Map<String, String> body) {
        String comments = body != null ? body.get("comments") : null;
        return ResponseEntity.ok(pfeService.acceptProject(projectId, comments));
    }

    @PutMapping("/{projectId}/reject")
    public ResponseEntity<PFE> rejectProject(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        String comments = body.get("comments");
        return ResponseEntity.ok(pfeService.rejectProject(projectId, reason, comments));
    }

    @PutMapping("/{projectId}/request-revision")
    public ResponseEntity<PFE> requestRevision(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> body) {
        String comments = body.get("comments");
        return ResponseEntity.ok(pfeService.requestRevision(projectId, comments));
    }

    // ============= Admin Endpoints =============

    @GetMapping("/pending-assignment")
    public ResponseEntity<List<PFE>> getPendingAssignmentProjects() {
        return ResponseEntity.ok(pfeService.getPendingAssignmentProjects());
    }

    @GetMapping("/{projectId}/recommendations")
    public ResponseEntity<List<AssignmentRecommendationDTO>> getRecommendations(@PathVariable Long projectId) {
        return ResponseEntity.ok(pfeService.getAssignmentRecommendations(projectId));
    }

    @PutMapping("/{projectId}/assign")
    public ResponseEntity<PFE> assignProfessor(
            @PathVariable Long projectId,
            @RequestBody Map<String, Object> body) {
        Long professorId = Long.valueOf(body.get("professorId").toString());
        String notes = body.get("notes") != null ? body.get("notes").toString() : null;
        return ResponseEntity.ok(pfeService.assignProfessor(projectId, professorId, notes));
    }

    // ============= Deliverables =============

    @GetMapping("/{projectId}/deliverables")
    public ResponseEntity<List<Livrable>> getDeliverables(@PathVariable Long projectId) {
        return ResponseEntity.ok(pfeService.getProjectDeliverables(projectId));
    }

    @PostMapping("/{projectId}/deliverables")
    public ResponseEntity<Livrable> addDeliverable(
            @PathVariable Long projectId,
            @RequestPart("data") DeliverableSubmissionDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        dto.setProjectId(projectId);
        return ResponseEntity.ok(pfeService.addDeliverable(projectId, dto, file));
    }

    @DeleteMapping("/deliverables/{deliverableId}")
    public ResponseEntity<?> deleteDeliverable(@PathVariable Long deliverableId) {
        pfeService.deleteDeliverable(deliverableId);
        return ResponseEntity.ok(Map.of("message", "Deliverable deleted successfully"));
    }

    // ============= Search & Stats =============

    @GetMapping("/search")
    public ResponseEntity<Page<PFE>> searchProjects(@RequestParam String q, Pageable pageable) {
        return ResponseEntity.ok(pfeService.searchProjects(q, pageable));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
                "activeProjects", pfeService.countActiveProjects(),
                "byStatus", pfeService.getProjectsCountByStatus(),
                "byDepartment", pfeService.getProjectsCountByDepartment()
        ));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<PFE>> getRecentSubmissions(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(pfeService.getRecentSubmissions(limit));
    }
}
