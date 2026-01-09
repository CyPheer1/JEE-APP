package ma.xproce.pfehub.dao.repositories;

import ma.xproce.pfehub.dao.entities.AppUser;
import ma.xproce.pfehub.dao.entities.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    
    Optional<AppUser> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<AppUser> findByRole(UserRole role);
    
    Page<AppUser> findByRole(UserRole role, Pageable pageable);
    
    @Query("SELECT u FROM AppUser u WHERE u.departement.id = :departementId")
    List<AppUser> findByDepartementId(@Param("departementId") Long departementId);
    
    @Query("SELECT u FROM AppUser u WHERE u.specialite.id = :specialiteId")
    List<AppUser> findBySpecialiteId(@Param("specialiteId") Long specialiteId);
    
    @Query("SELECT u FROM AppUser u WHERE u.isActive = true AND u.role = :role")
    List<AppUser> findActiveByRole(@Param("role") UserRole role);
    
    @Query("SELECT COUNT(u) FROM AppUser u WHERE u.role = :role")
    long countByRole(@Param("role") UserRole role);
    
    @Query("SELECT u FROM AppUser u WHERE " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<AppUser> searchUsers(@Param("search") String search, Pageable pageable);
}
