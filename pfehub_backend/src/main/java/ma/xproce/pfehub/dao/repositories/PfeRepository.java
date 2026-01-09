package ma.xproce.pfehub.dao.repositories;

import ma.xproce.pfehub.dao.entities.PFE;
import ma.xproce.pfehub.dao.entities.PFEStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PfeRepository extends JpaRepository<PFE, Long> {
    
    Optional<PFE> findByEtudiantId(Long etudiantId);
    
    List<PFE> findByEncadrantId(Long encadrantId);
    
    List<PFE> findByStatus(PFEStatus status);
    
    Page<PFE> findByStatus(PFEStatus status, Pageable pageable);
    
    @Query("SELECT p FROM PFE p WHERE p.status = :status")
    List<PFE> findAllByStatus(@Param("status") PFEStatus status);
    
    @Query("SELECT p FROM PFE p WHERE p.encadrant IS NULL AND p.status = 'EN_ATTENTE_ASSIGNATION'")
    List<PFE> findPendingAssignment();
    
    @Query("SELECT p FROM PFE p WHERE p.encadrant.id = :encadrantId AND p.status = :status")
    List<PFE> findByEncadrantIdAndStatus(@Param("encadrantId") Long encadrantId, @Param("status") PFEStatus status);
    
    @Query("SELECT p FROM PFE p WHERE p.etudiant.departement.id = :departementId")
    List<PFE> findByDepartementId(@Param("departementId") Long departementId);
    
    @Query("SELECT p FROM PFE p WHERE p.etudiant.specialite.id = :specialiteId")
    List<PFE> findBySpecialiteId(@Param("specialiteId") Long specialiteId);
    
    @Query("SELECT p FROM PFE p WHERE p.anneeUniversitaire.id = :anneeId")
    List<PFE> findByAnneeUniversitaireId(@Param("anneeId") Long anneeId);
    
    @Query("SELECT COUNT(p) FROM PFE p WHERE p.status = :status")
    long countByStatus(@Param("status") PFEStatus status);
    
    @Query("SELECT COUNT(p) FROM PFE p WHERE p.encadrant.id = :encadrantId")
    long countByEncadrantId(@Param("encadrantId") Long encadrantId);
    
    @Query("SELECT p.status, COUNT(p) FROM PFE p GROUP BY p.status")
    List<Object[]> countByStatusGrouped();
    
    @Query("SELECT p.etudiant.departement.name, COUNT(p) FROM PFE p GROUP BY p.etudiant.departement.name")
    List<Object[]> countByDepartementGrouped();
    
    @Query("SELECT p FROM PFE p WHERE " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<PFE> searchProjects(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT p FROM PFE p ORDER BY p.submittedAt DESC")
    List<PFE> findRecentSubmissions(Pageable pageable);
}
