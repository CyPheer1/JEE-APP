package ma.xproce.pfehub.dao.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "etudiants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Etudiant extends AppUser {
    
    @Column(name = "numero_etudiant", unique = true)
    private String numeroEtudiant;
    
    @Column
    private String promotion;
    
    @OneToOne(mappedBy = "etudiant", cascade = CascadeType.ALL)
    private PFE pfe;
    
    @ManyToOne
    @JoinColumn(name = "annee_universitaire_id")
    private AnneeUniversitaire anneeUniversitaire;
    
    @PrePersist
    @Override
    protected void onCreate() {
        super.onCreate();
        setRole(UserRole.ETUDIANT);
    }
}
