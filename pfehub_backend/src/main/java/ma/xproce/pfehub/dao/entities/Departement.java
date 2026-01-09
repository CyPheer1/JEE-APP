package ma.xproce.pfehub.dao.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "departements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Departement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @JsonIgnore
    @OneToMany(mappedBy = "departement", cascade = CascadeType.ALL)
    private List<Specialite> specialites = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
