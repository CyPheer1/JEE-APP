package ma.xproce.pfehub;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.dao.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final DepartementRepository departementRepository;
    private final SpecialiteRepository specialiteRepository;
    private final EtudiantRepository etudiantRepository;
    private final EncadrantRepository encadrantRepository;
    private final AdminRepository adminRepository;
    private final AnneeUniversitaireRepository anneeUniversitaireRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing ENSAM Casablanca data...");

        // Create Departments - ENSAM Casablanca
        Departement deptIAGI = createDepartment("Ingénierie en Automatique et Génie Informatique", "IAGI", "Département IAGI - Formation en automatique, informatique industrielle et génie informatique");
        Departement deptGIM = createDepartment("Génie Industriel et Maintenance", "GIM", "Département GIM - Formation en génie industriel, maintenance et qualité");
        Departement deptGMM = createDepartment("Génie Mécanique et Matériaux", "GMM", "Département GMM - Formation en conception mécanique et science des matériaux");
        Departement deptGEE = createDepartment("Génie Électrique et Énergétique", "GEE", "Département GEE - Formation en électrotechnique, électronique de puissance et énergies renouvelables");

        // Create Specializations - ENSAM Casablanca
        Specialite specIA = createSpecialization("Intelligence Artificielle et Big Data", "IABD", deptIAGI, "Spécialisation en IA, Machine Learning et traitement de données massives");
        Specialite specSI = createSpecialization("Systèmes d'Information", "SI", deptIAGI, "Spécialisation en développement logiciel et systèmes d'information");
        Specialite specAuto = createSpecialization("Automatique et Robotique", "AR", deptIAGI, "Spécialisation en automatique industrielle et robotique");
        Specialite specProd = createSpecialization("Management de la Production", "MP", deptGIM, "Spécialisation en gestion de production et supply chain");
        Specialite specConc = createSpecialization("Conception Mécanique", "CM", deptGMM, "Spécialisation en CAO/DAO et simulation mécanique");
        Specialite specEnR = createSpecialization("Énergies Renouvelables", "ENR", deptGEE, "Spécialisation en énergies renouvelables et efficacité énergétique");

        // Create Academic Year
        AnneeUniversitaire annee = createAcademicYear("2025-2026");

        // Create Admin - Direction ENSAM Casablanca
        Admin admin = createAdmin("Hassan", "El Moussaoui", "h.elmoussaoui@ensam-casa.ma", "admin123");

        // Create Professors - ENSAM Casablanca (vrais professeurs)
        Encadrant profBadr = createProfessor("Badr", "HIRCHOUA", "b.hirchoua@ensam-casa.ma", "prof123", 
                "JEE,Spring Boot,Architecture Logicielle,Microservices", deptIAGI, specSI);
        Encadrant profAzmi = createProfessor("Mohamed", "AZMI", "m.azmi@ensam-casa.ma", "prof123",
                "Intelligence Artificielle,Machine Learning,Deep Learning,Data Science", deptIAGI, specIA);
        Encadrant profAdil = createProfessor("Adil", "CHERGUI", "a.chergui@ensam-casa.ma", "prof123",
                "Systèmes Embarqués,IoT,Automatique Industrielle", deptIAGI, specAuto);
        Encadrant profMustapha = createProfessor("Mustapha", "HAIN", "m.hain@ensam-casa.ma", "prof123",
                "Réseaux,Sécurité Informatique,Cloud Computing,DevOps", deptIAGI, specSI);
        Encadrant profMouaad = createProfessor("Mouaad", "MOHY-EDDINE", "m.mohyeddine@ensam-casa.ma", "prof123",
                "Électronique de Puissance,Énergies Renouvelables,Smart Grid", deptGEE, specEnR);

        // Create Students - ENSAM Casablanca (Mohamed El Ouardi + autres étudiants)
        Etudiant studentMohamed = createStudent("Mohamed", "El Ouardi", "m.elouardi@etudiant.ensam-casa.ma", "etud123",
                "ENSAM2025001", "2025", deptIAGI, specSI, annee);
        Etudiant studentYassine = createStudent("Yassine", "Benali", "y.benali@etudiant.ensam-casa.ma", "etud123",
                "ENSAM2025002", "2025", deptIAGI, specIA, annee);
        Etudiant studentSoukaina = createStudent("Soukaina", "Lahlou", "s.lahlou@etudiant.ensam-casa.ma", "etud123",
                "ENSAM2025003", "2025", deptIAGI, specAuto, annee);
        Etudiant studentAmine = createStudent("Amine", "Tazi", "a.tazi@etudiant.ensam-casa.ma", "etud123",
                "ENSAM2025004", "2025", deptGIM, specProd, annee);
        Etudiant studentFatima = createStudent("Fatima Zahra", "Alami", "fz.alami@etudiant.ensam-casa.ma", "etud123",
                "ENSAM2025005", "2025", deptGMM, specConc, annee);
        Etudiant studentKarim = createStudent("Karim", "Mansouri", "k.mansouri@etudiant.ensam-casa.ma", "etud123",
                "ENSAM2025006", "2025", deptGEE, specEnR, annee);
        Etudiant studentImane = createStudent("Imane", "Chraibi", "i.chraibi@etudiant.ensam-casa.ma", "etud123",
                "ENSAM2025007", "2025", deptIAGI, specSI, annee);
        Etudiant studentOmar = createStudent("Omar", "Fassi Fihri", "o.fassifihri@etudiant.ensam-casa.ma", "etud123",
                "ENSAM2025008", "2025", deptIAGI, specIA, annee);

        log.info("ENSAM Casablanca data initialized successfully!");
        log.info("===========================================");
        log.info("Comptes de démonstration ENSAM Casablanca:");
        log.info("  Admin: h.elmoussaoui@ensam-casa.ma / admin123");
        log.info("  Professeur: b.hirchoua@ensam-casa.ma / prof123");
        log.info("  Professeur: m.azmi@ensam-casa.ma / prof123");
        log.info("  Étudiant: m.elouardi@etudiant.ensam-casa.ma / etud123");
        log.info("===========================================");
    }

    private Departement createDepartment(String name, String code, String description) {
        if (departementRepository.findByCode(code).isEmpty()) {
            Departement dept = new Departement();
            dept.setName(name);
            dept.setCode(code);
            dept.setDescription(description);
            return departementRepository.save(dept);
        }
        return departementRepository.findByCode(code).get();
    }

    private Specialite createSpecialization(String name, String code, Departement dept, String description) {
        if (specialiteRepository.findByCode(code).isEmpty()) {
            Specialite spec = new Specialite();
            spec.setName(name);
            spec.setCode(code);
            spec.setDepartement(dept);
            spec.setDescription(description);
            return specialiteRepository.save(spec);
        }
        return specialiteRepository.findByCode(code).get();
    }

    private AnneeUniversitaire createAcademicYear(String year) {
        if (anneeUniversitaireRepository.findByYear(year).isEmpty()) {
            AnneeUniversitaire annee = new AnneeUniversitaire();
            annee.setYear(year);
            annee.setSubmissionStartDate(LocalDate.of(2025, 9, 1));
            annee.setSubmissionEndDate(LocalDate.of(2026, 3, 31));
            annee.setDefenseStartDate(LocalDate.of(2026, 5, 1));
            annee.setDefenseEndDate(LocalDate.of(2026, 7, 15));
            annee.setIsCurrent(true);
            return anneeUniversitaireRepository.save(annee);
        }
        return anneeUniversitaireRepository.findByYear(year).get();
    }

    private Admin createAdmin(String firstName, String lastName, String email, String password) {
        if (adminRepository.findByEmail(email).isEmpty()) {
            Admin admin = new Admin();
            admin.setFirstName(firstName);
            admin.setLastName(lastName);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRole(UserRole.ADMIN);
            admin.setPermissions("ALL");
            return adminRepository.save(admin);
        }
        return adminRepository.findByEmail(email).get();
    }

    private Encadrant createProfessor(String firstName, String lastName, String email, String password,
                                       String expertise, Departement dept, Specialite spec) {
        if (encadrantRepository.findByEmail(email).isEmpty()) {
            Encadrant prof = new Encadrant();
            prof.setFirstName(firstName);
            prof.setLastName(lastName);
            prof.setEmail(email);
            prof.setPassword(passwordEncoder.encode(password));
            prof.setRole(UserRole.ENCADRANT);
            prof.setExpertise(expertise);
            prof.setMaxProjectCapacity(5);
            prof.setDepartement(dept);
            prof.setSpecialite(spec);
            return encadrantRepository.save(prof);
        }
        return encadrantRepository.findByEmail(email).get();
    }

    private Etudiant createStudent(String firstName, String lastName, String email, String password,
                                    String numeroEtudiant, String promotion, Departement dept, 
                                    Specialite spec, AnneeUniversitaire annee) {
        if (etudiantRepository.findByEmail(email).isEmpty()) {
            Etudiant etudiant = new Etudiant();
            etudiant.setFirstName(firstName);
            etudiant.setLastName(lastName);
            etudiant.setEmail(email);
            etudiant.setPassword(passwordEncoder.encode(password));
            etudiant.setRole(UserRole.ETUDIANT);
            etudiant.setNumeroEtudiant(numeroEtudiant);
            etudiant.setPromotion(promotion);
            etudiant.setDepartement(dept);
            etudiant.setSpecialite(spec);
            etudiant.setAnneeUniversitaire(annee);
            return etudiantRepository.save(etudiant);
        }
        return etudiantRepository.findByEmail(email).get();
    }
}
