package ma.xproce.pfehub.web;

import lombok.RequiredArgsConstructor;
import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.dao.repositories.*;
import ma.xproce.pfehub.service.*;
import ma.xproce.pfehub.web.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"}, allowCredentials = "true")
public class AdminController {

    private final IUserService userService;
    private final IPfeService pfeService;
    private final ISoutenanceService soutenanceService;
    private final DepartementRepository departementRepository;
    private final SpecialiteRepository specialiteRepository;
    private final AnneeUniversitaireRepository anneeUniversitaireRepository;

    // ============= Dashboard Stats =============

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(Map.of(
                "totalStudents", userService.countStudents(),
                "totalProfessors", userService.countProfessors(),
                "activeProjects", pfeService.countActiveProjects(),
                "upcomingDefenses", soutenanceService.countUpcoming(),
                "projectsByStatus", pfeService.getProjectsCountByStatus(),
                "projectsByDepartment", pfeService.getProjectsCountByDepartment(),
                "recentSubmissions", pfeService.getRecentSubmissions(5)
        ));
    }

    // ============= Departments =============

    @GetMapping("/departments")
    public ResponseEntity<List<Departement>> getAllDepartments() {
        return ResponseEntity.ok(departementRepository.findAll());
    }

    @GetMapping("/departments/{id}")
    public ResponseEntity<?> getDepartmentById(@PathVariable Long id) {
        return departementRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/departments")
    public ResponseEntity<Departement> createDepartment(@RequestBody Map<String, String> body) {
        Departement dept = new Departement();
        dept.setName(body.get("name"));
        dept.setCode(body.get("code"));
        dept.setDescription(body.get("description"));
        return ResponseEntity.ok(departementRepository.save(dept));
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<Departement> updateDepartment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Departement dept = departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        
        if (body.get("name") != null) dept.setName(body.get("name"));
        if (body.get("code") != null) dept.setCode(body.get("code"));
        if (body.get("description") != null) dept.setDescription(body.get("description"));
        
        return ResponseEntity.ok(departementRepository.save(dept));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        departementRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Department deleted successfully"));
    }

    // ============= Specializations =============

    @GetMapping("/specializations")
    public ResponseEntity<List<Specialite>> getAllSpecializations() {
        return ResponseEntity.ok(specialiteRepository.findAll());
    }

    @GetMapping("/specializations/{id}")
    public ResponseEntity<?> getSpecializationById(@PathVariable Long id) {
        return specialiteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/departments/{departmentId}/specializations")
    public ResponseEntity<List<Specialite>> getSpecializationsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(specialiteRepository.findByDepartementId(departmentId));
    }

    @PostMapping("/specializations")
    public ResponseEntity<Specialite> createSpecialization(@RequestBody Map<String, Object> body) {
        Specialite spec = new Specialite();
        spec.setName((String) body.get("name"));
        spec.setCode((String) body.get("code"));
        spec.setDescription((String) body.get("description"));
        
        Long departmentId = Long.valueOf(body.get("departmentId").toString());
        departementRepository.findById(departmentId)
                .ifPresent(spec::setDepartement);
        
        return ResponseEntity.ok(specialiteRepository.save(spec));
    }

    @PutMapping("/specializations/{id}")
    public ResponseEntity<Specialite> updateSpecialization(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Specialite spec = specialiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialization not found"));
        
        if (body.get("name") != null) spec.setName((String) body.get("name"));
        if (body.get("code") != null) spec.setCode((String) body.get("code"));
        if (body.get("description") != null) spec.setDescription((String) body.get("description"));
        
        if (body.get("departmentId") != null) {
            Long departmentId = Long.valueOf(body.get("departmentId").toString());
            departementRepository.findById(departmentId)
                    .ifPresent(spec::setDepartement);
        }
        
        return ResponseEntity.ok(specialiteRepository.save(spec));
    }

    @DeleteMapping("/specializations/{id}")
    public ResponseEntity<?> deleteSpecialization(@PathVariable Long id) {
        specialiteRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Specialization deleted successfully"));
    }

    // ============= Academic Years =============

    @GetMapping("/academic-years")
    public ResponseEntity<List<AnneeUniversitaire>> getAllAcademicYears() {
        return ResponseEntity.ok(anneeUniversitaireRepository.findAll());
    }

    @GetMapping("/academic-years/current")
    public ResponseEntity<?> getCurrentAcademicYear() {
        return anneeUniversitaireRepository.findByIsCurrentTrue()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/academic-years/{id}")
    public ResponseEntity<?> getAcademicYearById(@PathVariable Long id) {
        return anneeUniversitaireRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/academic-years")
    public ResponseEntity<AnneeUniversitaire> createAcademicYear(@RequestBody Map<String, String> body) {
        AnneeUniversitaire year = new AnneeUniversitaire();
        year.setYear(body.get("year"));
        year.setSubmissionStartDate(LocalDate.parse(body.get("submissionStartDate")));
        year.setSubmissionEndDate(LocalDate.parse(body.get("submissionEndDate")));
        year.setDefenseStartDate(LocalDate.parse(body.get("defenseStartDate")));
        year.setDefenseEndDate(LocalDate.parse(body.get("defenseEndDate")));
        year.setIsCurrent(Boolean.parseBoolean(body.getOrDefault("isCurrent", "false")));
        
        // If this is set as current, unset others
        if (year.getIsCurrent()) {
            anneeUniversitaireRepository.findByIsCurrentTrue()
                    .ifPresent(current -> {
                        current.setIsCurrent(false);
                        anneeUniversitaireRepository.save(current);
                    });
        }
        
        return ResponseEntity.ok(anneeUniversitaireRepository.save(year));
    }

    @PutMapping("/academic-years/{id}")
    public ResponseEntity<AnneeUniversitaire> updateAcademicYear(@PathVariable Long id, @RequestBody Map<String, String> body) {
        AnneeUniversitaire year = anneeUniversitaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic year not found"));
        
        if (body.get("year") != null) year.setYear(body.get("year"));
        if (body.get("submissionStartDate") != null) year.setSubmissionStartDate(LocalDate.parse(body.get("submissionStartDate")));
        if (body.get("submissionEndDate") != null) year.setSubmissionEndDate(LocalDate.parse(body.get("submissionEndDate")));
        if (body.get("defenseStartDate") != null) year.setDefenseStartDate(LocalDate.parse(body.get("defenseStartDate")));
        if (body.get("defenseEndDate") != null) year.setDefenseEndDate(LocalDate.parse(body.get("defenseEndDate")));
        
        if (body.get("isCurrent") != null) {
            boolean isCurrent = Boolean.parseBoolean(body.get("isCurrent"));
            if (isCurrent && !year.getIsCurrent()) {
                // Unset other current year
                anneeUniversitaireRepository.findByIsCurrentTrue()
                        .ifPresent(current -> {
                            if (!current.getId().equals(id)) {
                                current.setIsCurrent(false);
                                anneeUniversitaireRepository.save(current);
                            }
                        });
            }
            year.setIsCurrent(isCurrent);
        }
        
        return ResponseEntity.ok(anneeUniversitaireRepository.save(year));
    }

    @DeleteMapping("/academic-years/{id}")
    public ResponseEntity<?> deleteAcademicYear(@PathVariable Long id) {
        anneeUniversitaireRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Academic year deleted successfully"));
    }

    @PutMapping("/academic-years/{id}/set-current")
    public ResponseEntity<AnneeUniversitaire> setCurrentAcademicYear(@PathVariable Long id) {
        // Unset current
        anneeUniversitaireRepository.findByIsCurrentTrue()
                .ifPresent(current -> {
                    current.setIsCurrent(false);
                    anneeUniversitaireRepository.save(current);
                });
        
        // Set new current
        AnneeUniversitaire year = anneeUniversitaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic year not found"));
        year.setIsCurrent(true);
        
        return ResponseEntity.ok(anneeUniversitaireRepository.save(year));
    }
}
