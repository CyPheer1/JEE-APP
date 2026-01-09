package ma.xproce.pfehub.dao.repositories;

import ma.xproce.pfehub.dao.entities.Soutenance;
import ma.xproce.pfehub.dao.entities.SoutenanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SoutenanceRepository extends JpaRepository<Soutenance, Long> {
    
    Optional<Soutenance> findByPfeId(Long pfeId);
    
    Optional<Soutenance> findByPfeEtudiantId(Long etudiantId);
    
    List<Soutenance> findByStatus(SoutenanceStatus status);
    
    Page<Soutenance> findByStatus(SoutenanceStatus status, Pageable pageable);
    
    @Query("SELECT s FROM Soutenance s WHERE s.status = 'PROPOSEE'")
    List<Soutenance> findPendingProposals();
    
    @Query("SELECT s FROM Soutenance s WHERE s.pfe.encadrant.id = :encadrantId")
    List<Soutenance> findByEncadrantId(@Param("encadrantId") Long encadrantId);
    
    @Query("SELECT s FROM Soutenance s WHERE s.finalDate = :date")
    List<Soutenance> findByFinalDate(@Param("date") LocalDate date);
    
    @Query("SELECT s FROM Soutenance s WHERE s.finalDate BETWEEN :startDate AND :endDate")
    List<Soutenance> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT s FROM Soutenance s WHERE s.status = 'VALIDEE' AND s.finalDate >= :fromDate ORDER BY s.finalDate ASC")
    List<Soutenance> findUpcomingDefenses(@Param("fromDate") LocalDate fromDate);
    
    @Query("SELECT s FROM Soutenance s WHERE s.finalGrade IS NOT NULL")
    List<Soutenance> findEvaluatedDefenses();
    
    @Query("SELECT COUNT(s) FROM Soutenance s WHERE s.status = :status")
    long countByStatus(@Param("status") SoutenanceStatus status);
    
    @Query("SELECT COUNT(s) FROM Soutenance s WHERE s.finalDate >= :fromDate AND s.status = 'VALIDEE'")
    long countUpcoming(@Param("fromDate") LocalDate fromDate);
    
    @Query("SELECT s FROM Soutenance s WHERE s.finalRoom = :room AND s.finalDate = :date")
    List<Soutenance> findByRoomAndDate(@Param("room") String room, @Param("date") LocalDate date);
}
