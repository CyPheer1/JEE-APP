package ma.xproce.pfehub.dao.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Admin extends AppUser {
    
    @Column(columnDefinition = "TEXT")
    private String permissions;
    
    @PrePersist
    @Override
    protected void onCreate() {
        super.onCreate();
        setRole(UserRole.ADMIN);
    }
    
    public boolean hasPermission(String permission) {
        if (permissions == null) return false;
        return permissions.contains(permission);
    }
}
