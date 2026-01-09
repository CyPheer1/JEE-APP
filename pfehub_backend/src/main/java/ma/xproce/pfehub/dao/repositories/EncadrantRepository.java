package ma.xproce.pfehub.dao.repositories;

import ma.xproce.pfehub.dao.entities.Encadrant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EncadrantRepository extends JpaRepository<Encadrant, Long> {
    
    Optional<Encadrant> findByEmail(String email);
    
    List<Encadrant> findByDepartementId(Long departementId);
    
    List<Encadrant> findBySpecialiteId(Long specialiteId);
    
    @Query("SELECT e FROM Encadrant e WHERE SIZE(e.pfes) < e.maxProjectCapacity")
    List<Encadrant> findAvailableProfessors();
    
    @Query("SELECT e FROM Encadrant e WHERE e.expertise LIKE %:keyword%")
    List<Encadrant> findByExpertiseContaining(@Param("keyword") String keyword);
    
    @Query("SELECT e FROM Encadrant e WHERE e.specialite.id = :specialiteId AND SIZE(e.pfes) < e.maxProjectCapacity")
    List<Encadrant> findAvailableProfessorsBySpecialite(@Param("specialiteId") Long specialiteId);
    
    @Query("SELECT e FROM Encadrant e WHERE " +
           "(LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Encadrant> searchProfessors(@Param("search") String search, Pageable pageable);
}
