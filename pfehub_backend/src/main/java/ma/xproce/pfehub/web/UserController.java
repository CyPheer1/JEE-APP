package ma.xproce.pfehub.web;

import lombok.RequiredArgsConstructor;
import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.service.IUserService;
import ma.xproce.pfehub.web.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"}, allowCredentials = "true")
public class UserController {

    private final IUserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        Optional<AppUser> userOpt = userService.authenticate(loginDTO.getEmail(), loginDTO.getPassword());
        
        if (userOpt.isPresent()) {
            AppUser user = userOpt.get();
            UserResponseDTO response = UserResponseDTO.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .department(user.getDepartement() != null ? user.getDepartement().getName() : null)
                    .specialization(user.getSpecialite() != null ? user.getSpecialite().getName() : null)
                    .token("jwt-token-" + user.getId()) // Simplified token for demo
                    .build();
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    @GetMapping
    public ResponseEntity<Page<AppUser>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // Students endpoints
    @GetMapping("/students")
    public ResponseEntity<List<Etudiant>> getAllStudents() {
        return ResponseEntity.ok(userService.getAllStudents());
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        return userService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/students")
    public ResponseEntity<Etudiant> createStudent(@RequestBody CreateStudentDTO dto) {
        return ResponseEntity.ok(userService.createStudent(dto));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<Etudiant> updateStudent(@PathVariable Long id, @RequestBody UpdateStudentDTO dto) {
        return ResponseEntity.ok(userService.updateStudent(id, dto));
    }

    @GetMapping("/students/search")
    public ResponseEntity<Page<Etudiant>> searchStudents(@RequestParam String q, Pageable pageable) {
        return ResponseEntity.ok(userService.searchStudents(q, pageable));
    }

    // Professors endpoints
    @GetMapping("/professors")
    public ResponseEntity<List<Encadrant>> getAllProfessors() {
        return ResponseEntity.ok(userService.getAllProfessors());
    }

    @GetMapping("/professors/available")
    public ResponseEntity<List<Encadrant>> getAvailableProfessors() {
        return ResponseEntity.ok(userService.getAvailableProfessors());
    }

    @GetMapping("/professors/{id}")
    public ResponseEntity<?> getProfessorById(@PathVariable Long id) {
        return userService.getProfessorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/professors")
    public ResponseEntity<Encadrant> createProfessor(@RequestBody CreateProfessorDTO dto) {
        return ResponseEntity.ok(userService.createProfessor(dto));
    }

    @PutMapping("/professors/{id}")
    public ResponseEntity<Encadrant> updateProfessor(@PathVariable Long id, @RequestBody UpdateProfessorDTO dto) {
        return ResponseEntity.ok(userService.updateProfessor(id, dto));
    }

    @GetMapping("/professors/search")
    public ResponseEntity<Page<Encadrant>> searchProfessors(@RequestParam String q, Pageable pageable) {
        return ResponseEntity.ok(userService.searchProfessors(q, pageable));
    }

    // Admins endpoints
    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(userService.getAllAdmins());
    }

    @GetMapping("/admins/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        return userService.getAdminById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/admins")
    public ResponseEntity<Admin> createAdmin(@RequestBody CreateAdminDTO dto) {
        return ResponseEntity.ok(userService.createAdmin(dto));
    }

    // Statistics
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
                "totalStudents", userService.countStudents(),
                "totalProfessors", userService.countProfessors(),
                "totalAdmins", userService.countAdmins()
        ));
    }
}
