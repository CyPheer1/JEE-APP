package ma.xproce.pfehub.dao.repositories;

import ma.xproce.pfehub.dao.entities.Departement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartementRepository extends JpaRepository<Departement, Long> {
    
    Optional<Departement> findByCode(String code);
    
    Optional<Departement> findByName(String name);
    
    boolean existsByCode(String code);
}
