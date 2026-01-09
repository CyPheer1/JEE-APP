package ma.xproce.pfehub.service;

import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.web.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    
    // Authentication
    Optional<AppUser> authenticate(String email, String password);
    AppUser getCurrentUser(Long userId);
    
    // User management
    Page<AppUser> getAllUsers(Pageable pageable);
    Optional<AppUser> getUserById(Long id);
    Optional<AppUser> getUserByEmail(String email);
    void deleteUser(Long id);
    
    // Students
    Etudiant createStudent(CreateStudentDTO dto);
    Etudiant updateStudent(Long id, UpdateStudentDTO dto);
    List<Etudiant> getAllStudents();
    Page<Etudiant> searchStudents(String search, Pageable pageable);
    Optional<Etudiant> getStudentById(Long id);
    
    // Professors
    Encadrant createProfessor(CreateProfessorDTO dto);
    Encadrant updateProfessor(Long id, UpdateProfessorDTO dto);
    List<Encadrant> getAllProfessors();
    List<Encadrant> getAvailableProfessors();
    Page<Encadrant> searchProfessors(String search, Pageable pageable);
    Optional<Encadrant> getProfessorById(Long id);
    
    // Admins
    Admin createAdmin(CreateAdminDTO dto);
    List<Admin> getAllAdmins();
    Optional<Admin> getAdminById(Long id);
    
    // Statistics
    long countStudents();
    long countProfessors();
    long countAdmins();
}
