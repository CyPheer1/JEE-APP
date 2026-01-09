package ma.xproce.pfehub.service;

import lombok.RequiredArgsConstructor;
import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.dao.repositories.*;
import ma.xproce.pfehub.web.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserManager implements IUserService {

    private final AppUserRepository appUserRepository;
    private final EtudiantRepository etudiantRepository;
    private final EncadrantRepository encadrantRepository;
    private final AdminRepository adminRepository;
    private final DepartementRepository departementRepository;
    private final SpecialiteRepository specialiteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<AppUser> authenticate(String email, String password) {
        Optional<AppUser> userOpt = appUserRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            AppUser user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    @Override
    public AppUser getCurrentUser(Long userId) {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public Page<AppUser> getAllUsers(Pageable pageable) {
        return appUserRepository.findAll(pageable);
    }

    @Override
    public Optional<AppUser> getUserById(Long id) {
        return appUserRepository.findById(id);
    }

    @Override
    public Optional<AppUser> getUserByEmail(String email) {
        return appUserRepository.findByEmail(email);
    }

    @Override
    public void deleteUser(Long id) {
        appUserRepository.deleteById(id);
    }

    @Override
    public Etudiant createStudent(CreateStudentDTO dto) {
        if (appUserRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Etudiant etudiant = new Etudiant();
        etudiant.setFirstName(dto.getFirstName());
        etudiant.setLastName(dto.getLastName());
        etudiant.setEmail(dto.getEmail());
        etudiant.setPassword(passwordEncoder.encode(dto.getPassword()));
        etudiant.setNumeroEtudiant(dto.getNumeroEtudiant());
        etudiant.setPromotion(dto.getPromotion());
        etudiant.setRole(UserRole.ETUDIANT);

        if (dto.getDepartementId() != null) {
            departementRepository.findById(dto.getDepartementId())
                    .ifPresent(etudiant::setDepartement);
        }
        if (dto.getSpecialiteId() != null) {
            specialiteRepository.findById(dto.getSpecialiteId())
                    .ifPresent(etudiant::setSpecialite);
        }

        return etudiantRepository.save(etudiant);
    }

    @Override
    public Etudiant updateStudent(Long id, UpdateStudentDTO dto) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (dto.getFirstName() != null) etudiant.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) etudiant.setLastName(dto.getLastName());
        if (dto.getEmail() != null) etudiant.setEmail(dto.getEmail());
        if (dto.getNumeroEtudiant() != null) etudiant.setNumeroEtudiant(dto.getNumeroEtudiant());
        if (dto.getPromotion() != null) etudiant.setPromotion(dto.getPromotion());

        if (dto.getDepartementId() != null) {
            departementRepository.findById(dto.getDepartementId())
                    .ifPresent(etudiant::setDepartement);
        }
        if (dto.getSpecialiteId() != null) {
            specialiteRepository.findById(dto.getSpecialiteId())
                    .ifPresent(etudiant::setSpecialite);
        }

        return etudiantRepository.save(etudiant);
    }

    @Override
    public List<Etudiant> getAllStudents() {
        return etudiantRepository.findAll();
    }

    @Override
    public Page<Etudiant> searchStudents(String search, Pageable pageable) {
        return etudiantRepository.searchStudents(search, pageable);
    }

    @Override
    public Optional<Etudiant> getStudentById(Long id) {
        return etudiantRepository.findById(id);
    }

    @Override
    public Encadrant createProfessor(CreateProfessorDTO dto) {
        if (appUserRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Encadrant encadrant = new Encadrant();
        encadrant.setFirstName(dto.getFirstName());
        encadrant.setLastName(dto.getLastName());
        encadrant.setEmail(dto.getEmail());
        encadrant.setPassword(passwordEncoder.encode(dto.getPassword()));
        encadrant.setExpertise(dto.getExpertise());
        encadrant.setMaxProjectCapacity(dto.getMaxProjectCapacity() != null ? dto.getMaxProjectCapacity() : 5);
        encadrant.setRole(UserRole.ENCADRANT);

        if (dto.getDepartementId() != null) {
            departementRepository.findById(dto.getDepartementId())
                    .ifPresent(encadrant::setDepartement);
        }
        if (dto.getSpecialiteId() != null) {
            specialiteRepository.findById(dto.getSpecialiteId())
                    .ifPresent(encadrant::setSpecialite);
        }

        return encadrantRepository.save(encadrant);
    }

    @Override
    public Encadrant updateProfessor(Long id, UpdateProfessorDTO dto) {
        Encadrant encadrant = encadrantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        if (dto.getFirstName() != null) encadrant.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) encadrant.setLastName(dto.getLastName());
        if (dto.getEmail() != null) encadrant.setEmail(dto.getEmail());
        if (dto.getExpertise() != null) encadrant.setExpertise(dto.getExpertise());
        if (dto.getMaxProjectCapacity() != null) encadrant.setMaxProjectCapacity(dto.getMaxProjectCapacity());

        if (dto.getDepartementId() != null) {
            departementRepository.findById(dto.getDepartementId())
                    .ifPresent(encadrant::setDepartement);
        }
        if (dto.getSpecialiteId() != null) {
            specialiteRepository.findById(dto.getSpecialiteId())
                    .ifPresent(encadrant::setSpecialite);
        }

        return encadrantRepository.save(encadrant);
    }

    @Override
    public List<Encadrant> getAllProfessors() {
        return encadrantRepository.findAll();
    }

    @Override
    public List<Encadrant> getAvailableProfessors() {
        return encadrantRepository.findAvailableProfessors();
    }

    @Override
    public Page<Encadrant> searchProfessors(String search, Pageable pageable) {
        return encadrantRepository.searchProfessors(search, pageable);
    }

    @Override
    public Optional<Encadrant> getProfessorById(Long id) {
        return encadrantRepository.findById(id);
    }

    @Override
    public Admin createAdmin(CreateAdminDTO dto) {
        if (appUserRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Admin admin = new Admin();
        admin.setFirstName(dto.getFirstName());
        admin.setLastName(dto.getLastName());
        admin.setEmail(dto.getEmail());
        admin.setPassword(passwordEncoder.encode(dto.getPassword()));
        admin.setPermissions(dto.getPermissions());
        admin.setRole(UserRole.ADMIN);

        return adminRepository.save(admin);
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    @Override
    public long countStudents() {
        return appUserRepository.countByRole(UserRole.ETUDIANT);
    }

    @Override
    public long countProfessors() {
        return appUserRepository.countByRole(UserRole.ENCADRANT);
    }

    @Override
    public long countAdmins() {
        return appUserRepository.countByRole(UserRole.ADMIN);
    }
}
