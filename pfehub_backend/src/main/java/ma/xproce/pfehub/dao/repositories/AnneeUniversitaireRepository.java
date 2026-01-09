package ma.xproce.pfehub.dao.repositories;

import ma.xproce.pfehub.dao.entities.AnneeUniversitaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnneeUniversitaireRepository extends JpaRepository<AnneeUniversitaire, Long> {
    
    Optional<AnneeUniversitaire> findByYear(String year);
    
    Optional<AnneeUniversitaire> findByIsCurrentTrue();
    
    boolean existsByYear(String year);
    
    @Query("UPDATE AnneeUniversitaire a SET a.isCurrent = false WHERE a.isCurrent = true")
    void resetAllCurrent();
}
