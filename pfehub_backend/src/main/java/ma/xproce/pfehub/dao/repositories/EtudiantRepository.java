package ma.xproce.pfehub.dao.repositories;

import ma.xproce.pfehub.dao.entities.Etudiant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    
    Optional<Etudiant> findByEmail(String email);
    
    Optional<Etudiant> findByNumeroEtudiant(String numeroEtudiant);
    
    List<Etudiant> findByDepartementId(Long departementId);
    
    List<Etudiant> findBySpecialiteId(Long specialiteId);
    
    List<Etudiant> findByPromotion(String promotion);
    
    @Query("SELECT e FROM Etudiant e WHERE e.pfe IS NULL")
    List<Etudiant> findStudentsWithoutProject();
    
    @Query("SELECT e FROM Etudiant e WHERE e.pfe IS NOT NULL")
    List<Etudiant> findStudentsWithProject();
    
    @Query("SELECT e FROM Etudiant e WHERE " +
           "(LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.numeroEtudiant) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Etudiant> searchStudents(@Param("search") String search, Pageable pageable);
}
