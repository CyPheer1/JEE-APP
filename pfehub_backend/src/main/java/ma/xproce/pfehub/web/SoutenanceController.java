package ma.xproce.pfehub.web;

import lombok.RequiredArgsConstructor;
import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.service.ISoutenanceService;
import ma.xproce.pfehub.web.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/defenses")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"}, allowCredentials = "true")
public class SoutenanceController {

    private final ISoutenanceService soutenanceService;

    // ============= CRUD =============

    @GetMapping
    public ResponseEntity<Page<Soutenance>> getAllDefenses(
            @RequestParam(required = false) SoutenanceStatus status,
            Pageable pageable) {
        if (status != null) {
            return ResponseEntity.ok(soutenanceService.getDefensesByStatus(status, pageable));
        }
        return ResponseEntity.ok(soutenanceService.getAllDefenses(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDefenseById(@PathVariable Long id) {
        return soutenanceService.getDefenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDefense(@PathVariable Long id) {
        soutenanceService.deleteDefense(id);
        return ResponseEntity.ok(Map.of("message", "Defense deleted successfully"));
    }

    // ============= Query Endpoints =============

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getDefenseByProject(@PathVariable Long projectId) {
        return soutenanceService.getDefenseByProjectId(projectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getDefenseByStudent(@PathVariable Long studentId) {
        return soutenanceService.getDefenseByStudentId(studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<Soutenance>> getDefensesByProfessor(@PathVariable Long professorId) {
        return ResponseEntity.ok(soutenanceService.getDefensesByProfessorId(professorId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Soutenance>> getPendingProposals() {
        return ResponseEntity.ok(soutenanceService.getPendingProposals());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Soutenance>> getUpcomingDefenses(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate) {
        if (fromDate == null) {
            fromDate = LocalDate.now();
        }
        return ResponseEntity.ok(soutenanceService.getUpcomingDefenses(fromDate));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Soutenance>> getDefensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(soutenanceService.getDefensesByDateRange(startDate, endDate));
    }

    @GetMapping("/evaluated")
    public ResponseEntity<List<Soutenance>> getEvaluatedDefenses() {
        return ResponseEntity.ok(soutenanceService.getEvaluatedDefenses());
    }

    // ============= Workflow: Propose (Professor) =============

    @PostMapping("/propose")
    public ResponseEntity<Soutenance> proposeDefense(@RequestBody DefenseProposalDTO dto) {
        return ResponseEntity.ok(soutenanceService.proposeDefense(dto));
    }

    // ============= Workflow: Admin Actions =============

    @PutMapping("/{defenseId}/validate")
    public ResponseEntity<Soutenance> validateDefense(
            @PathVariable Long defenseId,
            @RequestBody DefenseValidationDTO dto) {
        dto.setDefenseId(defenseId);
        return ResponseEntity.ok(soutenanceService.validateDefense(dto));
    }

    @PutMapping("/{defenseId}/modify")
    public ResponseEntity<Soutenance> modifyDefense(
            @PathVariable Long defenseId,
            @RequestBody DefenseModificationDTO dto) {
        dto.setDefenseId(defenseId);
        return ResponseEntity.ok(soutenanceService.modifyDefense(dto));
    }

    @PutMapping("/{defenseId}/reject")
    public ResponseEntity<Soutenance> rejectDefense(
            @PathVariable Long defenseId,
            @RequestBody DefenseRejectionDTO dto) {
        dto.setDefenseId(defenseId);
        return ResponseEntity.ok(soutenanceService.rejectDefense(dto));
    }

    // ============= Workflow: Evaluation (Professor) =============

    @PutMapping("/{defenseId}/evaluate")
    public ResponseEntity<Soutenance> evaluateDefense(
            @PathVariable Long defenseId,
            @RequestBody DefenseEvaluationDTO dto) {
        dto.setDefenseId(defenseId);
        return ResponseEntity.ok(soutenanceService.evaluateDefense(dto));
    }

    // ============= Jury Management =============

    @GetMapping("/{defenseId}/jury")
    public ResponseEntity<List<JuryMember>> getJuryMembers(@PathVariable Long defenseId) {
        return ResponseEntity.ok(soutenanceService.getJuryMembers(defenseId));
    }

    @PutMapping("/{defenseId}/jury")
    public ResponseEntity<?> updateJuryMembers(
            @PathVariable Long defenseId,
            @RequestBody List<JuryMemberDTO> juryMembers) {
        soutenanceService.updateJuryMembers(defenseId, juryMembers);
        return ResponseEntity.ok(Map.of("message", "Jury members updated successfully"));
    }

    // ============= Conflict Detection =============

    @GetMapping("/check-conflict")
    public ResponseEntity<?> checkConflict(
            @RequestParam String room,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String time) {
        boolean hasConflict = soutenanceService.hasConflict(room, date, time);
        return ResponseEntity.ok(Map.of("hasConflict", hasConflict));
    }

    @GetMapping("/by-room-date")
    public ResponseEntity<List<Soutenance>> getByRoomAndDate(
            @RequestParam String room,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(soutenanceService.getDefensesByRoomAndDate(room, date));
    }

    // ============= Statistics =============

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
                "pending", soutenanceService.countByStatus(SoutenanceStatus.PROPOSEE),
                "validated", soutenanceService.countByStatus(SoutenanceStatus.VALIDEE),
                "upcoming", soutenanceService.countUpcoming()
        ));
    }
}
