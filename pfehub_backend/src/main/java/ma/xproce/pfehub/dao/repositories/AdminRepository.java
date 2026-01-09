package ma.xproce.pfehub.dao.repositories;

import ma.xproce.pfehub.dao.entities.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    
    Optional<Admin> findByEmail(String email);
}
