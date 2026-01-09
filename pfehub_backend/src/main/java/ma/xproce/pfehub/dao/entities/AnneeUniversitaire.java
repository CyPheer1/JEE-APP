package ma.xproce.pfehub.dao.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "annees_universitaires")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnneeUniversitaire {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "annee", nullable = false, unique = true)
    private String year; // Ex: "2024-2025"
    
    @Column(name = "submission_start_date")
    private LocalDate submissionStartDate;
    
    @Column(name = "submission_end_date")
    private LocalDate submissionEndDate;
    
    @Column(name = "defense_start_date")
    private LocalDate defenseStartDate;
    
    @Column(name = "defense_end_date")
    private LocalDate defenseEndDate;
    
    @Column(name = "is_current")
    private Boolean isCurrent = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public boolean isSubmissionPeriodActive() {
        LocalDate now = LocalDate.now();
        return submissionStartDate != null && submissionEndDate != null 
            && !now.isBefore(submissionStartDate) && !now.isAfter(submissionEndDate);
    }
    
    public boolean isDefensePeriodActive() {
        LocalDate now = LocalDate.now();
        return defenseStartDate != null && defenseEndDate != null 
            && !now.isBefore(defenseStartDate) && !now.isAfter(defenseEndDate);
    }
}
