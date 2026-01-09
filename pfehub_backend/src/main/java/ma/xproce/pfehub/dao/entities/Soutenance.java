package ma.xproce.pfehub.dao.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "soutenances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Soutenance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "pfe_id", nullable = false)
    private PFE pfe;
    
    @Column(name = "proposed_date")
    private LocalDate proposedDate;
    
    @Column(name = "proposed_time")
    private LocalTime proposedTime;
    
    @Column(name = "proposed_room")
    private String proposedRoom;
    
    @Column(name = "final_date")
    private LocalDate finalDate;
    
    @Column(name = "final_time")
    private LocalTime finalTime;
    
    @Column(name = "final_room")
    private String finalRoom;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SoutenanceStatus status = SoutenanceStatus.PROPOSEE;
    
    @JsonIgnore
    @OneToMany(mappedBy = "soutenance", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JuryMember> juryMembers = new ArrayList<>();
    
    @Column(name = "proposed_at")
    private LocalDateTime proposedAt;
    
    @Column(name = "validated_at")
    private LocalDateTime validatedAt;
    
    @ManyToOne
    @JoinColumn(name = "validated_by_id")
    private Admin validatedBy;
    
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
    
    @Column(name = "modification_reason", columnDefinition = "TEXT")
    private String modificationReason;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    // Evaluation fields
    @Column(name = "presentation_quality")
    private Double presentationQuality;
    
    @Column(name = "subject_mastery")
    private Double subjectMastery;
    
    @Column(name = "question_answers")
    private Double questionAnswers;
    
    @Column(name = "time_respect")
    private Double timeRespect;
    
    @Column(name = "final_grade")
    private Double finalGrade;
    
    @Column(name = "evaluation_comments", columnDefinition = "TEXT")
    private String evaluationComments;
    
    @Column(columnDefinition = "TEXT")
    private String strengths;
    
    @Column(columnDefinition = "TEXT")
    private String improvements;
    
    @Column(name = "evaluated_at")
    private LocalDateTime evaluatedAt;
    
    @ManyToOne
    @JoinColumn(name = "evaluated_by_id")
    private Encadrant evaluatedBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (proposedAt == null) {
            proposedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public boolean isEvaluated() {
        return finalGrade != null && evaluatedAt != null;
    }
}
