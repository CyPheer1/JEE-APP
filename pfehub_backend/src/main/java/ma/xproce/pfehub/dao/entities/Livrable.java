package ma.xproce.pfehub.dao.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "livrables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Livrable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "pfe_id", nullable = false)
    private PFE pfe;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LivrableType type;
    
    @Column(name = "file_url")
    private String fileUrl;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
    }
}
