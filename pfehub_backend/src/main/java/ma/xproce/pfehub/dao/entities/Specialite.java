package ma.xproce.pfehub.dao.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "specialites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Specialite {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @ManyToOne
    @JoinColumn(name = "departement_id", nullable = false)
    private Departement departement;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
