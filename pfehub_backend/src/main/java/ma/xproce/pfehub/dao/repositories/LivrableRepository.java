package ma.xproce.pfehub.dao.repositories;

import ma.xproce.pfehub.dao.entities.Livrable;
import ma.xproce.pfehub.dao.entities.LivrableType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivrableRepository extends JpaRepository<Livrable, Long> {
    
    List<Livrable> findByPfeId(Long pfeId);
    
    List<Livrable> findByPfeIdAndType(Long pfeId, LivrableType type);
    
    long countByPfeId(Long pfeId);
}
