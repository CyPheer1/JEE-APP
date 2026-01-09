package ma.xproce.pfehub.dao.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "encadrants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Encadrant extends AppUser {
    
    @Column(columnDefinition = "TEXT")
    private String expertise;
    
    @Column(name = "max_project_capacity")
    private Integer maxProjectCapacity = 5;
    
    @JsonIgnore
    @OneToMany(mappedBy = "encadrant", fetch = FetchType.LAZY)
    private List<PFE> pfes = new ArrayList<>();
    
    @PrePersist
    @Override
    protected void onCreate() {
        super.onCreate();
        setRole(UserRole.ENCADRANT);
    }
    
    @JsonIgnore
    public int getCurrentProjectCount() {
        return pfes != null ? pfes.size() : 0;
    }
    
    @JsonIgnore
    public boolean canAcceptMoreProjects() {
        return getCurrentProjectCount() < maxProjectCapacity;
    }
    
    public List<String> getExpertiseList() {
        if (expertise == null || expertise.isEmpty()) {
            return new ArrayList<>();
        }
        return List.of(expertise.split(","));
    }
}
