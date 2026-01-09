package ma.xproce.pfehub.dao.repositories;

import ma.xproce.pfehub.dao.entities.JuryMember;
import ma.xproce.pfehub.dao.entities.JuryRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JuryMemberRepository extends JpaRepository<JuryMember, Long> {
    
    List<JuryMember> findBySoutenanceId(Long soutenanceId);
    
    List<JuryMember> findByProfessorId(Long professorId);
    
    List<JuryMember> findBySoutenanceIdAndRole(Long soutenanceId, JuryRole role);
    
    void deleteBySoutenanceId(Long soutenanceId);
}
