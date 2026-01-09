package ma.xproce.pfehub.dao.repositories;

import ma.xproce.pfehub.dao.entities.Specialite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpecialiteRepository extends JpaRepository<Specialite, Long> {
    
    Optional<Specialite> findByCode(String code);
    
    List<Specialite> findByDepartementId(Long departementId);
    
    boolean existsByCode(String code);
}
