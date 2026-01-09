package ma.xproce.pfehub.dao.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pfes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PFE {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String objectives;
    
    @Column(columnDefinition = "TEXT")
    private String context;
    
    @Column(columnDefinition = "TEXT")
    private String methodology;
    
    @Column(columnDefinition = "TEXT")
    private String expectedResults;
    
    @Column(columnDefinition = "TEXT")
    private String keywords;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PFEStatus status = PFEStatus.EN_ATTENTE_ASSIGNATION;
    
    @OneToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;
    
    @ManyToOne
    @JoinColumn(name = "encadrant_id")
    private Encadrant encadrant;
    
    @Column(name = "proposal_file_path")
    private String proposalFilePath;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
    
    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;
    
    @Column(name = "final_submitted_at")
    private LocalDateTime finalSubmittedAt;
    
    @Column(name = "professor_comments", columnDefinition = "TEXT")
    private String professorComments;
    
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
    
@JsonIgnore
    @OneToMany(mappedBy = "pfe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Livrable> livrables = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "pfe", cascade = CascadeType.ALL)
    private Soutenance soutenance;
    
    @ManyToOne
    @JoinColumn(name = "annee_universitaire_id")
    private AnneeUniversitaire anneeUniversitaire;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public List<String> getKeywordsList() {
        if (keywords == null || keywords.isEmpty()) {
            return new ArrayList<>();
        }
        return List.of(keywords.split(","));
    }
    
    public void setKeywordsList(List<String> keywordsList) {
        if (keywordsList != null && !keywordsList.isEmpty()) {
            this.keywords = String.join(",", keywordsList);
        }
    }
}
